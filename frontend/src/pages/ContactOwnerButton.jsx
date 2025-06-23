import React from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ContactOwnerButton = ({ ownerEmail, spaceName }) => {
  const handleContactClick = async () => {
    const subject = `Inquiry about your space: ${spaceName}`;
    const body = `Hi, I'm interested in booking your coworking space "${spaceName}". Please share more details.`;

    try {
      const response = await axios.post(`${API_BASE_URL}/send_email`, {
        to_email: ownerEmail,
        subject,
        body
      });

      if (response.status === 200) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    }
  };

  return (
    <button className="contact-button" onClick={handleContactClick}>
      Contact Owner
    </button>
  );
};

export default ContactOwnerButton;
