require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure your email transport (Gmail example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS  // your Gmail app password
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  const { fullName, email, orderNumber, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  // Email to site owner
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'aharano.biz@gmail.com',
    subject: 'New Inquiry from FTP Contact Form',
    text: `Name: ${fullName}\nEmail: ${email}\nOrder Number: ${orderNumber || 'N/A'}\nMessage: ${message}`
  };

  // (Optional) Confirmation email to user
  const confirmOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting FTP',
    text: `Hi ${fullName},\n\nThank you for reaching out! We have received your inquiry and will get back to you soon.\n\nYour message:\n${message}\n\nBest regards,\nFTP Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    // Uncomment the next line to send confirmation to user
    // await transporter.sendMail(confirmOptions);
    res.json({ success: true, message: 'Inquiry sent!' });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 