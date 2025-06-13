# Cowork Connect

Cowork Connect is a modern web application that connects workspace seekers with available coworking spaces. It provides a seamless platform for users to find, book, and manage their workspace needs.

## Features

### For Workspace Seekers
- User authentication and profile management
- Personalized workspace preferences
- Browse available coworking spaces
- Filter spaces based on location, price, and amenities
- View detailed space information including images and reviews
- Secure payment integration with UPI
- Review and rating system for spaces

### For Space Owners
- Space owner authentication and dashboard
- Upload and manage workspace listings
- Add multiple images and UPI QR codes
- Set pricing and availability
- View and manage bookings
- Receive notifications for new bookings

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- CSS for styling
- Modern UI/UX design

### Backend
- Python Flask
- PostgreSQL database
- SQLAlchemy ORM
- Flask-Migrate for database migrations
- Flask-Mail for email notifications
- CORS support

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- PostgreSQL
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cowork-connect.git
cd cowork-connect
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Configure the database:
- Create a PostgreSQL database named 'cowork_connect'
- Update the database configuration in `backend/config.py`

4. Set up the frontend:
```bash
cd frontend
npm install
```

5. Create a `.env` file in the backend directory with the following variables:
```
SECRET_KEY=your_secret_key
SMTP_USER=your_email
SMTP_PASSWORD=your_email_password
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
```

## Running the Application

1. Start the backend server:
```bash
cd backend
flask run
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
cowork-connect/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── requirements.txt
│   └── uploads/
│       ├── images/
│       └── upi_qr_codes/
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── assets/
│       └── App.jsx
└── README.md
```

## API Endpoints

### Authentication
- POST `/signup` - User registration
- POST `/login` - User login
- POST `/spaceowner/signup` - Space owner registration
- POST `/spaceowner/login` - Space owner login

### Spaces
- GET `/api/spaces` - Get all spaces
- GET `/api/spaces/<id>` - Get space details
- POST `/spaceowner/space` - Upload new space
- GET `/spaceowner/spaces` - Get spaces by owner

### Reviews
- POST `/api/reviews` - Add a review
- GET `/api/spaces/<id>/reviews` - Get space reviews

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any queries or support, please contact:
- Email: coworkconnect425@gmail.com
- Project Link: [https://github.com/yourusername/cowork-connect](https://github.com/yourusername/cowork-connect) 