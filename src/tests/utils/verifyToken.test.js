// src/tests/utils/verifyToken.test.js
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../utils/verifyToken.js';
import { AppError } from '../../utils/AppError.js';

describe('verifyToken', () => {
  const SECRET = 'testsecret123';

  beforeAll(() => {
    // Garante que process.env.JWT_SECRET estará definida
    process.env.JWT_SECRET = SECRET;
  });

  it('deve retornar o payload decodificado quando o token for válido', () => {
    // Monte um payload de exemplo
    const payload = { userId: 42, role: 'user' };
    // Gere um token válido com o mesmo secret
    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('deve lançar AppError quando o token for inválido', () => {
    const badToken = 'esseNaoEUmTokenValido';

    expect(() => verifyToken(badToken)).toThrow(AppError);
    try {
      verifyToken(badToken);
    } catch (err) {
      // Verifica as propriedades do erro customizado
      expect(err).toBeInstanceOf(AppError);
      expect(err.message).toBe('Token inválido ou expirado');
      expect(err.statusCode).toBe(401);
      expect(err.code).toBe('INVALID_OR_EXPIRED_TOKEN');
      expect(err.isOperational).toBe(true);
    }
  });

  it('deve lançar AppError quando o token estiver expirado', () => {
    const payload = { foo: 'bar' };
    // Gere um token que expira imediatamente
    const token = jwt.sign(payload, SECRET, { expiresIn: '1ms' });

    // aguarda 10ms para garantir expiração
    return new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
      expect(() => verifyToken(token)).toThrow(AppError);
    });
  });
});
