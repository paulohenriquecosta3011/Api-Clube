import 'dotenv/config';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function test() {
  try {
    const msg = {
      to: 'paulinhocosta3011@gmail.com',
      from: process.env.EMAIL_FROM,
      subject: 'Teste SendGrid na VM 🚀',
      html: '<h1>Email funcionando na VM!</h1>',
    };

    const response = await sgMail.send(msg);

    console.log('✅ Email enviado com sucesso!');
    console.log('Status:', response[0].statusCode);
  } catch (error) {
    console.error('❌ Erro ao enviar email');
    console.error(error.response?.body || error.message);
  }
}


test();
