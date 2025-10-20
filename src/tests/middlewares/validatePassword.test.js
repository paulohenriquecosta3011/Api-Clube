import { validatePassword } from '../../../src/middlewares/validatePassword.js';
import { AppError } from '../../../src/utils/AppError.js';

describe('validatePassword middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  it('deve chamar next() se a senha for válida', () => {
    req.body.password = '123456';
    const middleware = validatePassword();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('deve lançar AppError se a senha for muito curta', () => {
    req.body.password = '123';
    const middleware = validatePassword();

    expect(() => middleware(req, res, next)).toThrow(AppError);
    expect(() => middleware(req, res, next)).toThrow('Senha deve ter ao menos 6 caracteres.');
  });

  it('deve validar usando campo customizado', () => {
    req.body.newPassword = 'abcdef';
    const middleware = validatePassword('newPassword');

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('deve lançar erro com campo customizado inválido', () => {
    req.body.newPassword = 'abc';
    const middleware = validatePassword('newPassword');

    expect(() => middleware(req, res, next)).toThrow(AppError);
    expect(() => middleware(req, res, next)).toThrow('Senha deve ter ao menos 6 caracteres.');
  });
});
