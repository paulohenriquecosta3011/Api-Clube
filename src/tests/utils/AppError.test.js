// src/tests/utils/AppError.test.js
import { AppError } from '../../utils/AppError.js';

describe('AppError', () => {
  it('deve criar um erro com valores padrão (400, code null, isOperational true, status "fail")', () => {
    const message = 'Recurso não encontrado';
    const err = new AppError(message);

    // É instância de Error e de AppError
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AppError);

    // Mensagem
    expect(err.message).toBe(message);
    // Default statusCode
    expect(err.statusCode).toBe(400);
    // Para 4xx, status textual deve ser 'fail'
    expect(err.status).toBe('fail');
    // Código interno padrão é null
    expect(err.code).toBeNull();
    // isOperational default true
    expect(err.isOperational).toBe(true);
    // Deve ter stack trace
    expect(typeof err.stack).toBe('string');
  });

  it('deve definir status "error" para statusCode >= 500', () => {
    const err = new AppError('Erro interno', 500);

    expect(err.statusCode).toBe(500);
    expect(err.status).toBe('error');
  });

  it('deve aceitar code e isOperational customizados', () => {
    const err = new AppError(
      'Erro de negócio',
      422,
      'BUSINESS_ERROR',
      false
    );

    expect(err.message).toBe('Erro de negócio');
    expect(err.statusCode).toBe(422);
    // 422 é 4xx → status continua 'fail'
    expect(err.status).toBe('fail');
    expect(err.code).toBe('BUSINESS_ERROR');
    expect(err.isOperational).toBe(false);
  });
});
