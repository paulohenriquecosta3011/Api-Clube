import { authorizeAdmin } from '../../middlewares/authMiddleware.js';
import { AppError } from '../../utils/AppError.js';

describe('authorizeAdmin middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    // req e res podem ser objetos vazios ou com o que for necessário
    req = {};
    res = {};
    next = jest.fn();
  });

  it('deve chamar next() sem argumentos se req.user.tipo_user for "A"', () => {
    req.user = { tipo_user: 'A' };

    authorizeAdmin(req, res, next);

    // next foi chamado uma vez, sem erro
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('deve chamar next com AppError se req.user não existir', () => {
    // req.user indefinido
    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('Acesso negado. Apenas administradores.');
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
    expect(err.isOperational).toBe(true);
  });

  it('deve chamar next com AppError se req.user.tipo_user não for "A"', () => {
    req.user = { tipo_user: 'U' };  // usuário não admin

    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('Acesso negado. Apenas administradores.');
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
    expect(err.isOperational).toBe(true);
  });
});
