
import { extractTokenFromHeader } from '../../utils/extractTokenFromHeader.js';

describe('extractTokenFromHeader', () => {
  it('deve retornar o token quando o header Authorization estiver correto', () => {
    const headers = {
      authorization: 'Bearer meu_token_123'
    };

    const token = extractTokenFromHeader(headers);
    expect(token).toBe('meu_token_123');
  });

  it('deve funcionar mesmo se a chave for "Authorization" com letra maiúscula', () => {
    const headers = {
      Authorization: 'Bearer outro_token_456'
    };

    const token = extractTokenFromHeader(headers);
    expect(token).toBe('outro_token_456');
  });

  it('deve retornar null se o header não começar com "Bearer "', () => {
    const headers = {
      authorization: 'Token token123'
    };

    const token = extractTokenFromHeader(headers);
    expect(token).toBeNull();
  });

  it('deve retornar null se não houver Authorization no header', () => {
    const headers = {};

    const token = extractTokenFromHeader(headers);
    expect(token).toBeNull();
  });
});
