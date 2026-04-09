const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: jsonHeaders,
  body: JSON.stringify(body)
});

const sanitizeText = (value, maxLength) => {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
};

exports.handler = async function(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: jsonHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { success: false, message: 'Method not allowed' });
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const contactReceiver = process.env.CONTACT_RECEIVER_EMAIL || 'alidue992@gmail.com';

  if (!gmailUser || !gmailAppPassword) {
    return createResponse(500, { success: false, message: 'Email service is not configured' });
  }

  let parsedBody;
  try {
    parsedBody = JSON.parse(event.body || '{}');
  } catch {
    return createResponse(400, { success: false, message: 'Invalid request payload' });
  }

  const name = sanitizeText(parsedBody.name, 120);
  const senderEmail = sanitizeText(parsedBody.email, 200).toLowerCase();
  const message = sanitizeText(parsedBody.message, 5000);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !senderEmail || !message) {
    return createResponse(400, { success: false, message: 'Please fill out all fields.' });
  }

  if (!emailRegex.test(senderEmail)) {
    return createResponse(400, { success: false, message: 'Please enter a valid email address.' });
  }

  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch (error) {
    console.error('Failed to load nodemailer:', error.message);
    return createResponse(500, { success: false, message: 'Email service dependency is unavailable' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword
      }
    });

    await transporter.sendMail({
      from: `ModernPhotoTools Contact <${gmailUser}>`,
      to: contactReceiver,
      replyTo: senderEmail,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${senderEmail}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${senderEmail}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `
    });

    return createResponse(200, {
      success: true,
      message: "Your message has been sent. We'll get back to you soon!"
    });
  } catch (error) {
    console.error('Failed to send contact email:', error.message);
    return createResponse(500, { success: false, message: 'Failed to send message. Please try again.' });
  }
};
