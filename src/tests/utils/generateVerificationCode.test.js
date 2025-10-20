import generateVerificationCode from '../../utils/generateVerificationCode.js'; // import default

describe('generateVerificationCode', () => {
  it('deve retornar um código de 6 dígitos como string', () => {
    const code = generateVerificationCode();
    expect(typeof code).toBe('string');
    expect(code.length).toBe(6);
    expect(/^\d{6}$/.test(code)).toBe(true);
  });

  it('deve gerar códigos diferentes em chamadas consecutivas', () => {
    const code1 = generateVerificationCode();
    const code2 = generateVerificationCode();
    expect(code1).not.toBe(code2);
  });
});
