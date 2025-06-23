import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret_key')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///local.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Contact Form Email Configuration
    MAIL_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.environ.get('SMTP_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get('SMTP_USER')
    MAIL_PASSWORD = os.environ.get('SMTP_PASSWORD')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'coworkconnect425@gmail.com')
    MAIL_RECIPIENT = os.environ.get('MAIL_RECIPIENT', 'coworkconnect425@gmail.com')