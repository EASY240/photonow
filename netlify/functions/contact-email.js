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

const verifyTurnstileToken = async ({ token, remoteIp, secretKey }) => {
  const formData = new URLSearchParams();
  formData.append('secret', secretKey);
  formData.append('response', token);
  if (remoteIp) {
    formData.append('remoteip', remoteIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  });

  if (!response.ok) {
    return { success: false, reason: 'CAPTCHA verification failed at provider.' };
  }

  const result = await response.json();
  if (!result?.success) {
    return { success: false, reason: 'CAPTCHA challenge was not completed successfully.' };
  }

  return { success: true };
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
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpSecure =
    String(process.env.SMTP_SECURE || (smtpPort === 465 ? 'true' : 'false')).toLowerCase() === 'true';
  const mailUser = process.env.SMTP_USER || gmailUser;
  const mailPassword = process.env.SMTP_PASS || gmailAppPassword;
  const contactReceiver = process.env.CONTACT_RECEIVER_EMAIL || 'alizurschmiede@modernphototools.com';
  const turnstileSecretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!mailUser || !mailPassword) {
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
  const captchaToken = sanitizeText(parsedBody.captchaToken, 2048);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !senderEmail || !message) {
    return createResponse(400, { success: false, message: 'Please fill out all fields.' });
  }

  if (!emailRegex.test(senderEmail)) {
    return createResponse(400, { success: false, message: 'Please enter a valid email address.' });
  }

  if (!turnstileSecretKey) {
    return createResponse(500, { success: false, message: 'CAPTCHA service is not configured' });
  }

  if (!captchaToken) {
    return createResponse(400, { success: false, message: 'Please complete the CAPTCHA challenge.' });
  }

  const remoteIpHeader = event.headers?.['x-forwarded-for'] || event.headers?.['X-Forwarded-For'] || '';
  const remoteIp = String(remoteIpHeader).split(',')[0]?.trim();
  const captchaResult = await verifyTurnstileToken({
    token: captchaToken,
    remoteIp,
    secretKey: turnstileSecretKey
  });

  if (!captchaResult.success) {
    return createResponse(400, { success: false, message: captchaResult.reason });
  }

  let nodemailer;
  try {
    nodemailer = require('nodemailer');
  } catch (error) {
    console.error('Failed to load nodemailer:', error.message);
    return createResponse(500, { success: false, message: 'Email service dependency is unavailable' });
  }

  try {
    const transporter = nodemailer.createTransport(
      smtpHost
        ? {
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            auth: {
              user: mailUser,
              pass: mailPassword
            }
          }
        : {
            service: 'gmail',
            auth: {
              user: mailUser,
              pass: mailPassword
            }
          }
    );

    await transporter.sendMail({
      from: `ModernPhotoTools Contact <${mailUser}>`,
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
