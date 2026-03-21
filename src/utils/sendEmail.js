//sendEmail.js
import nodemailer from 'nodemailer';

export async function sendValidationCodeEmail(email, codigo) {
  try {
    if (process.env.SEND_EMAIL !== 'true') {
      console.log("ENVIO DE EMAIL DESABILITADO");
      console.log(`Simulando envio para: ${email} | Código: ${codigo}`);
      return;
    }    
    console.log(" enviando email 1 ")
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou use 'hotmail', 'outlook' ou SMTP personalizado
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(" enviando email 2 ")
    const mailOptions = {
      from: `"Clube da Uva" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Seu Código de Validação',
      text: `Seu código de validação é: ${codigo}`,
    };

    console.log(" enviando email 3 ")
    const info = await transporter.sendMail(mailOptions);
    console.log('E-mail enviado:', info.response);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw error;
  }
}
