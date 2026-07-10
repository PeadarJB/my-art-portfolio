import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import './Contact.scss';

const ContactForm = () => {
  const form = useRef();
  const [emailSent, setEmailSent] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();

    // Check if all fields are filled
    if (userName.trim() === '' || userEmail.trim() === '' || message.trim() === '') {
      setErrorMessage('All fields are required. Please fill in all fields.');
      return;
    }

    // If fields are filled, proceed with sending the email
    emailjs.sendForm('peadarjb', 'studio_peadarjb_contact', form.current, '2f3L4kwmh5y22ciQS')
      .then(
        (result) => {
          console.log(result.text);
          setEmailSent(true);
          setUserName('');
          setUserEmail('');
          setMessage('');
          setErrorMessage(''); // Clear any error messages
        },
        (error) => {
          console.log(error.text);
          setErrorMessage('Failed to send the message, please try again.');
        }
      );
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case 'user_name':
        setUserName(value);
        break;
      case 'user_email':
        setUserEmail(value);
        break;
      case 'message':
        setMessage(value);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {!emailSent ? (
        <form ref={form} onSubmit={sendEmail} className='contact-form'>
          <h2>Get in touch</h2>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <label>Name:</label>
          <input
            type="text"
            name="user_name"
            value={userName}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
          <label>Email:</label>
          <input
            type="email"
            name="user_email"
            value={userEmail}
            onChange={handleChange}
            placeholder="Your email"
            required
          />
          <label>Message:</label>
          <textarea
            name="message"
            value={message}
            onChange={handleChange}
            placeholder="Please leave your message here"
            required
          />
          <button type="submit">Send</button>
        </form>
      ) : (
        <div className='success-message'>
          <h3>Thank you for your message, {userName}! We will get back to you soon.</h3>
        </div>
      )}
    </div>
  );
};

export default ContactForm;