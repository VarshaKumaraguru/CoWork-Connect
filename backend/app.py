from flask import Flask, request, jsonify, session, send_from_directory
import smtplib
from dotenv import load_dotenv
from email.mime.text import MIMEText
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import os
from config import Config
from flask_migrate import Migrate
import time
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_mail import Mail, Message

app = Flask(__name__)
load_dotenv()
app.config.from_object(Config)
db = SQLAlchemy(app)
migrate = Migrate(app, db)  # Initialize Flask-Migrate
CORS(app, supports_credentials=True)

# Initialize Flask-Mail for contact form
contact_mail = Mail(app)
contact_mail.init_app(app)

# Ensure upload directories exist
UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads', 'images')
UPI_QR_FOLDER = os.path.join(app.root_path, 'upi_qr_codes')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(UPI_QR_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['UPI_QR_FOLDER'] = UPI_QR_FOLDER

# Print directory information at startup
print(f"Upload folder path: {UPLOAD_FOLDER}")
print(f"UPI QR folder path: {UPI_QR_FOLDER}")
print(f"Upload folder exists: {os.path.exists(UPLOAD_FOLDER)}")
print(f"UPI QR folder exists: {os.path.exists(UPI_QR_FOLDER)}")

# User model (Space Finder)
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)

# Space Owner model
class SpaceOwner(db.Model):
    __tablename__ = 'owners'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

# Space model
class Space(db.Model):
    __tablename__ = 'spaces'
    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, nullable=False)
    space_name = db.Column(db.String(255), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    price_per_hour = db.Column(db.Float, nullable=False)
    amenities = db.Column(db.Text, nullable=False)
    duration = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_urls = db.Column(db.Text, nullable=False)
    upi_qr_code = db.Column(db.String(255), nullable=False)

# Review model
class Review(db.Model):
    __tablename__ = 'reviews'
    id = db.Column(db.Integer, primary_key=True)
    space_id = db.Column(db.Integer, db.ForeignKey('spaces.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rating = db.Column(db.Float, nullable=False)
    review_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user = db.relationship('User', backref='reviews')

# --------------------------
# User and Space Owner APIs
# --------------------------

# User Sign-Up
@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    username = data.get("username")

    if not email or not password or not username:
        return jsonify({"error": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already in use"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already in use"}), 400

    hashed_password = generate_password_hash(password)
    new_user = User(email=email, password=hashed_password, username=username)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

# User Login
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    user = User.query.filter_by(username=username).first()  # Check by username only

    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"message": "Login successful", "user_id": user.id}), 200

# Space Owner Sign-Up
@app.route("/spaceowner/signup", methods=["POST"])
def spaceowner_signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    if SpaceOwner.query.filter_by(email=email).first():
        return jsonify({"error": "Space owner already exists"}), 400

    hashed_password = generate_password_hash(password)
    new_owner = SpaceOwner(username=username, email=email, password=hashed_password)
    db.session.add(new_owner)
    db.session.commit()

    return jsonify({"message": "Space owner registered successfully"}), 201

# Space Owner Login
@app.route("/spaceowner/login", methods=["POST"])
def spaceowner_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Missing fields"}), 400

    owner = SpaceOwner.query.filter_by(username=username).first()  # Check by username only

    if not owner or not check_password_hash(owner.password, password):
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({
        "message": "Space owner login successful",
        "owner_id": owner.id,
        "username": owner.username,
        "dashboard_url": "/dashboard"
    }), 200

# --------------------------
# Space Management APIs
# --------------------------

# Upload space details
@app.route("/spaceowner/space", methods=["POST"])
def upload_space_details():
    print("Received space upload request")  # Debug log
    data = request.form
    files = request.files.getlist("images")
    upi_qr = request.files.get("upi_qr")  # Get UPI QR code file
    
    print("Form data:", data)  # Debug log
    print("Files received:", [f.filename for f in files])  # Debug log
    print("UPI QR file:", upi_qr.filename if upi_qr else None)  # Debug log
    
    owner_id = data.get("owner_id")
    space_name = data.get("space_name")
    location = data.get("location")
    price_per_hour = data.get("price_per_hour")
    amenities = data.get("amenities")
    duration = data.get("duration")
    description = data.get("description")

    if not all([owner_id, space_name, location, price_per_hour]):
        return jsonify({"error": "Required fields missing"}), 400

    try:
        price_per_hour = float(price_per_hour)
    except ValueError:
        return jsonify({"error": "Invalid price value"}), 400

    image_urls = []
    for file in files:
        if file and file.filename:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            image_urls.append(filename)

    image_urls_str = ",".join(image_urls)

    # Handle UPI QR code upload
    upi_qr_filename = None
    if upi_qr and upi_qr.filename:
        try:
            # Get the file extension
            file_ext = os.path.splitext(upi_qr.filename)[1]
            # Generate a unique filename for the UPI QR code
            timestamp = int(time.time())
            upi_qr_filename = secure_filename(f"upi_qr_{owner_id}_{timestamp}{file_ext}")
            upi_qr_path = os.path.join(app.config['UPI_QR_FOLDER'], upi_qr_filename)
            
            print(f"Saving UPI QR code to: {upi_qr_path}")  # Debug log
            # Save the UPI QR code file
            upi_qr.save(upi_qr_path)
            print(f"Successfully saved UPI QR code: {upi_qr_filename}")  # Debug log
            
            # Verify the file was saved
            if os.path.exists(upi_qr_path):
                print(f"Verified UPI QR code file exists at: {upi_qr_path}")
            else:
                print(f"Warning: UPI QR code file not found at: {upi_qr_path}")
        except Exception as e:
            print(f"Error saving UPI QR code: {str(e)}")  # Debug log
            return jsonify({"error": "Failed to save UPI QR code"}), 500
    else:
        print("No UPI QR code file received")  # Debug log

    print(f"Creating new space with UPI QR code filename: {upi_qr_filename}")  # Debug log
    
    new_space = Space(
        owner_id=owner_id,
        space_name=space_name,
        location=location,
        price_per_hour=price_per_hour,
        amenities=amenities,
        duration=duration,
        description=description,
        image_urls=image_urls_str,
        upi_qr_code=upi_qr_filename
    )
    
    try:
        db.session.add(new_space)
        db.session.commit()
        print(f"Successfully created new space with ID: {new_space.id}")  # Debug log
        print(f"UPI QR code filename in database: {new_space.upi_qr_code}")  # Debug log
        return jsonify({"message": "Space uploaded successfully", "space_id": new_space.id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error creating space: {str(e)}")  # Debug log
        return jsonify({"error": "Failed to create space"}), 500

# Get spaces by owner
@app.route("/spaceowner/spaces", methods=["GET"])
def get_spaces():
    owner_id = request.args.get("owner_id")
    if not owner_id or owner_id == 'undefined':
        return jsonify({"error": "Owner ID required"}), 400
    
    spaces = Space.query.filter_by(owner_id=owner_id).all()
    space_list = []
    for space in spaces:
        owner = SpaceOwner.query.get(space.owner_id)
        # Split the image_urls string and create proper URLs
        image_urls = []
        if space.image_urls:
            for img in space.image_urls.split(","):
                if img:  # Only add non-empty strings
                    image_urls.append(f"/uploads/images/{img.strip()}")
        
        space_list.append({
            "id": space.id,
            "space_name": space.space_name,
            "location": space.location,
            "price_per_hour": space.price_per_hour,
            "amenities": space.amenities,
            "duration": space.duration,
            "description": space.description,
            "image_urls": image_urls,
            "owner_email": owner.email if owner else None
        })
        
    return jsonify({"spaces": space_list}), 200

# Serve uploaded images
@app.route('/uploads/images/<path:filename>')
def serve_image(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except Exception as e:
        print(f"Error serving image {filename}: {str(e)}")
        return jsonify({"error": "Image not found"}), 404

# Serve UPI QR codes
@app.route('/upi_qr_codes/<path:filename>')
def serve_upi_qr(filename):
    try:
        return send_from_directory(app.config['UPI_QR_FOLDER'], filename)
    except Exception as e:
        print(f"Error serving UPI QR code {filename}: {str(e)}")
        return jsonify({"error": "UPI QR code not found"}), 404

# Delete a space by ID
@app.route("/spaceowner/space/<int:space_id>", methods=["DELETE"])
def delete_space(space_id):
    data = request.get_json()
    owner_id = data.get("owner_id")

    if not owner_id:
        return jsonify({"error": "Owner ID is required for deletion"}), 400

    space = Space.query.get(space_id)
    if not space:
        return jsonify({"error": f"Space with ID {space_id} not found"}), 404

    if str(space.owner_id) != str(owner_id):
        return jsonify({"error": "Unauthorized: You can only delete your own space"}), 403

    try:
        # Delete images if any
        if space.image_urls:
            image_filenames = space.image_urls.split(",")
            for filename in image_filenames:
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                if os.path.exists(file_path):
                    os.remove(file_path)

        # Delete space record
        db.session.delete(space)
        db.session.commit()
        return jsonify({"message": "Space deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete space: {str(e)}"}), 500

# Get all spaces (for users)
@app.route("/api/spaces", methods=["GET"])
def get_spaces_with_reviews():
    spaces = Space.query.all()
    result = []
    for space in spaces:
        # Parse image_urls (assume comma-separated string or JSON array)
        image_urls = []
        if space.image_urls:
            for img in space.image_urls.split(","):
                if img.strip():  # Only add non-empty strings
                    # Add the full URL including the server address
                    image_urls.append(f"http://localhost:5000/uploads/images/{img.strip()}")
        
        # Get reviews for this space using SQLAlchemy
        reviews = Review.query.filter_by(space_id=space.id).order_by(Review.created_at.desc()).all()
        print(f"Reviews for space {space.id}:", [r.id for r in reviews])  # Debug log
        
        reviews_list = [{
            'id': r.id,
            'user_id': r.user_id,
            'user_name': r.user.username if r.user else None,
            'rating': r.rating,
            'review_text': r.review_text,
            'created_at': r.created_at
        } for r in reviews]
        
        print(f"Reviews list for space {space.id}:", reviews_list)  # Debug log
        avg_rating = round(sum([r.rating for r in reviews]) / len(reviews), 2) if reviews else 0
        
        # Get owner information
        owner = SpaceOwner.query.get(space.owner_id)
        
        # Handle UPI QR code URL
        upi_qr_url = None
        if space.upi_qr_code:
            upi_qr_url = f"http://localhost:5000/upi_qr_codes/{space.upi_qr_code}"
        
        space_data = {
            'id': space.id,
            'space_name': space.space_name,
            'location': space.location,
            'amenities': space.amenities,
            'price_per_hour': space.price_per_hour,
            'duration': space.duration,
            'description': space.description,
            'image_urls': image_urls,
            'upi_qr_code': upi_qr_url,
            'owner_email': owner.email if owner else None,
            'reviews': reviews_list,
            'average_rating': avg_rating
        }
        print(f"Space data for {space.id}:", space_data)  # Debug log
        result.append(space_data)
    return jsonify({'spaces': result})

# Debug route to list all spaces with IDs
@app.route("/api/debug/spaces", methods=["GET"])
def debug_spaces():
    spaces = Space.query.all()
    space_list = []
    for space in spaces:
        space_list.append({
            "id": space.id,
            "space_name": space.space_name,
            "owner_id": space.owner_id,
            "upi_qr_code": space.upi_qr_code
        })
    return jsonify({"spaces": space_list}), 200

@app.route('/api/user', methods=['GET'])
def get_current_user():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        return jsonify({"username": user.username})
    return jsonify({"error": "User not logged in"}), 401

@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.json
    to_email = data.get('to_email')
    subject = data.get('subject')
    body = data.get('body')

    # Use SMTP user (authenticated sender) as from_email
    from_email = os.getenv("SMTP_USER")

    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = from_email
        msg['To'] = to_email

        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")

        # Basic null check for required env vars
        if not all([smtp_server, smtp_port, smtp_user, smtp_password]):
            raise Exception("Missing SMTP configuration in environment variables.")

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(from_email, [to_email], msg.as_string())
        server.quit()

        return jsonify({'message': 'Email sent successfully'}), 200

    except Exception as e:
        print("Error sending email:", e)
        return jsonify({'error': 'Failed to send email'}), 500

# Get space by ID
@app.route("/api/spaces/<int:space_id>", methods=["GET"])
def get_space_by_id(space_id):
    print(f"Fetching space with ID: {space_id}")  # Debug log
    space = Space.query.get(space_id)
    if not space:
        print(f"Space with ID {space_id} not found")  # Debug log
        return jsonify({"error": "Space not found"}), 404

    print(f"Found space: {space.space_name}")  # Debug log
    print(f"UPI QR code filename: {space.upi_qr_code}")  # Debug log

    owner = SpaceOwner.query.get(space.owner_id)
    image_urls = []
    if space.image_urls:
        for img in space.image_urls.split(","):
            if img:
                image_urls.append(f"http://localhost:5000/uploads/images/{img.strip()}")

    # Handle UPI QR code URL
    upi_qr_url = None
    if space.upi_qr_code:
        upi_qr_url = f"http://localhost:5000/upi_qr_codes/{space.upi_qr_code}"

    space_data = {
        "id": space.id,
        "space_name": space.space_name,
        "location": space.location,
        "price_per_hour": space.price_per_hour,
        "amenities": space.amenities,
        "duration": space.duration,
        "description": space.description,
        "image_urls": image_urls,
        "owner_email": owner.email if owner else None,
        "upi_qr_code": upi_qr_url
    }

    print(f"Returning space data: {space_data}")  # Debug log
    return jsonify(space_data), 200

# Refactor /api/reviews endpoint to use SQLAlchemy
@app.route('/api/reviews', methods=['POST'])
def add_review():
    try:
        data = request.get_json()
        space_id = data.get('space_id')
        user_id = data.get('user_id')
        rating = float(data.get('rating'))
        review_text = data.get('review_text')
        if not all([space_id, user_id, rating, review_text]):
            return jsonify({'success': False, 'error': 'Missing required fields'}), 400
        review = Review(
            space_id=space_id,
            user_id=user_id,
            rating=rating,
            review_text=review_text
        )
        db.session.add(review)
        db.session.commit()
        user = User.query.get(user_id)
        review_data = {
            'id': review.id,
            'space_id': review.space_id,
            'user_id': review.user_id,
            'user_name': user.username if user else None,
            'rating': review.rating,
            'review_text': review.review_text,
            'created_at': review.created_at
        }
        return jsonify({'success': True, 'review': review_data}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error adding review: {str(e)}")
        return jsonify({'success': False, 'error': 'Failed to add review'}), 500

# Contact form submission
@app.route("/api/contact", methods=["POST"])
def contact():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')  # This is the user's email
        message = data.get('message')

        if not all([name, email, message]):
            return jsonify({"error": "All fields are required"}), 400

        # Use the user's email as the sender
        from_email = email
        to_email = "coworkconnect425@gmail.com"  # Fixed recipient email

        msg = MIMEText(f"""
        Name: {name}
        Email: {email}
        Message: {message}
        """)
        msg['Subject'] = f"New Contact Form Submission from {name}"
        msg['From'] = from_email
        msg['To'] = to_email

        # Get SMTP configuration from environment variables
        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_password = os.getenv("SMTP_PASSWORD")

        # Basic null check for required env vars
        if not all([smtp_server, smtp_port, smtp_user, smtp_password]):
            raise Exception("Missing SMTP configuration in environment variables.")

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(from_email, [to_email], msg.as_string())
        server.quit()

        return jsonify({"message": "Email sent successfully"}), 200

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({"error": "Failed to send email"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)