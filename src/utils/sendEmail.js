import nodemailer from 'nodemailer';

// console.log('SMTP config:', {
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   user: process.env.SMTP_AUTH_USER,
// });
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASSWORD,
  },
});

export async function sendEmail(to, subject, html) {
  try {
    const result = await transport.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log('✅ Email sent:', result.response);
    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}
