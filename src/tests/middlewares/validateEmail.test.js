//validateEmail.test.js
import { validateEmail } from '../../../src/middlewares/validateEmail.js';
import { AppError } from '../../../src/utils/AppError.js';

describe('validateEmail middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  it('deve chamar next() se o email for válido', () => {
    req.body.email = 'teste@exemplo.com';
    const middleware = validateEmail();

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('deve lançar AppError se o email for inválido', () => {
    req.body.email = 'email-invalido';
    const middleware = validateEmail();

    expect(() => middleware(req, res, next)).toThrow(AppError);
    expect(() => middleware(req, res, next)).toThrow('Formato de email inválido.');
  });

  it('deve validar corretamente usando um campo customizado', () => {
    req.body.userEmail = 'usuario@site.com';
    const middleware = validateEmail('userEmail');

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('deve lançar AppError com campo customizado inválido', () => {
    req.body.userEmail = 'invalido';
    const middleware = validateEmail('userEmail');

    expect(() => middleware(req, res, next)).toThrow(AppError);
    expect(() => middleware(req, res, next)).toThrow('Formato de email inválido.');
  });
});
