//sendEmail.js
import nodemailer from 'nodemailer';

export async function sendValidationCodeEmail(email, codigo) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou use 'hotmail', 'outlook' ou SMTP personalizado
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Clube da Uva" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Seu Código de Validação',
      text: `Seu código de validação é: ${codigo}`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado:', info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
}
