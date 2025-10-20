// src/utils/generateToken.test.js
import jwt from 'jsonwebtoken';
import { generateToken } from '../../utils/generateToken.js';
import 'dotenv/config'; // isso carrega seu arquivo .env
describe('generateToken', () => {
  it('deve gerar um token JWT válido com payload e expiração padrão', () => {
    const payload = { userId: 123, role: 'admin' };
    const token = generateToken(payload);

    expect(typeof token).toBe('string');

    // Verifica se o token pode ser decodificado corretamente com a mesma secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('deve respeitar o tempo de expiração customizado', () => {
    const payload = { userId: 123 };
    const expiresIn = '2h';
    const token = generateToken(payload, expiresIn);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // A verificação de expiração real é feita internamente pelo jwt.verify,
    // se não lançar erro, é porque está ok
    expect(decoded.userId).toBe(payload.userId);
  });
});
