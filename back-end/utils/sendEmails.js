const nodemailer = require('nodemailer');

async function sendEmail(userEmail,subject,htmlTemplate) {
  try {
    console.log(userEmail)
    // Create a SMTP transporter object
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.APP_EMAIL_ADDRESS, // your Gmail address
        pass: process.env.APP_EMAIL_PASS, // your Gmail password
      },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.APP_EMAIL_ADDRESS,
      to: userEmail,
      subject: subject,
      html: htmlTemplate,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (err) {
    console.error('Error occurred while sending email:', err.message);
  }
}

module.exports={
  sendEmail
}