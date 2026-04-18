//sendgrid.service.js
import sgMail from '@sendgrid/mail';


if (process.env.NODE_ENV !== 'test') {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function sendEmail({ to, subject, html, from }) {
  try {
    const msg = {
      to,
      from: from || process.env.EMAIL_FROM,
      subject,
      html,
    };

    const response = await sgMail.send(msg);


    return response;
  } catch (error) {
    console.error('Erro ao enviar email (SendGrid):');
    console.error(error.response?.body || error.message);

    throw error;
  }
}