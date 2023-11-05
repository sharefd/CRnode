const nodemailer = require('nodemailer');

const sendEmail = async (subject, text, to) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD
    }
  });

  const info = await transporter.sendMail({
    from: '"Cloudrounds Notifications" <cloudrounds.notifications@gmail.com>',
    to,
    subject,
    text
  });

  console.log('Message sent:', info.messageId);
};

const sendRegistrationLink = async emailContent => {
  const { to, subject, html } = emailContent;

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_HOST_USER,
      pass: process.env.EMAIL_HOST_PASSWORD
    }
  });

  const mailOptions = {
    from: '"Cloudrounds Notifications" <cloudrounds.notifications@gmail.com>',
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent:', info.messageId);
};

module.exports = { sendEmail, sendRegistrationLink };
