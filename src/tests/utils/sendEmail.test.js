// src/tests/utils/sendEmail.test.js
import nodemailer from 'nodemailer';
import { sendValidationCodeEmail } from '../../utils/sendEmail.js';

jest.mock('nodemailer');


beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });
    

describe('sendValidationCodeEmail', () => {
  const mockSendMail = jest.fn();

  beforeAll(() => {
    // Mock do createTransport para retornar um objeto com sendMail mockado
    nodemailer.createTransport.mockReturnValue({
      sendMail: mockSendMail,
    });
  });

  beforeEach(() => {
    mockSendMail.mockClear();
  });

  it('deve chamar sendMail com os parâmetros corretos', async () => {
    mockSendMail.mockResolvedValue({ response: '250 OK' });

    const email = 'test@example.com';
    const codigo = '123456';

    await sendValidationCodeEmail(email, codigo);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    expect(mockSendMail).toHaveBeenCalledWith({
      from: `"Clube da Uva" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Seu Código de Validação',
      text: `Seu código de validação é: ${codigo}`,
    });
  });

  it('deve lançar erro se o sendMail falhar', async () => {
    const error = new Error('Falha no envio');
    mockSendMail.mockRejectedValue(error);

    await expect(sendValidationCodeEmail('anyemail@example.com', '000000')).rejects.toThrow('Falha no envio');
  });
});
