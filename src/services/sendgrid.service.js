import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmail({ to, subject, html, from }) {
  try {
    const info = await transporter.sendMail({
      from: from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log('E-mail enviado com sucesso:', info.messageId);

    return info;
  } catch (error) {
    console.error('Erro ao enviar e-mail pelo Gmail:', error.message);

    throw error;
  }
}