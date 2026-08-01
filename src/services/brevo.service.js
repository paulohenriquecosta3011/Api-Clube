import { BrevoClient } from '@getbrevo/brevo';

export async function sendEmail({ to, subject, html, from }) {
  try {
    const client = new BrevoClient({
      apiKey: process.env.BREVO_API_KEY,
    });

    const response = await client.transactionalEmails.sendTransacEmail({
      sender: {
        name: 'Clube Uva',
        email: process.env.EMAIL_FROM,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: html,
    });

    console.log('Email enviado pelo Brevo:', response);

    return response;

  } catch (error) {
    console.error('Erro ao enviar email pelo Brevo:');
    console.error(error.message);

    throw error;
  }
}