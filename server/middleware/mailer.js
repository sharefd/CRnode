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

module.exports = sendEmail;
