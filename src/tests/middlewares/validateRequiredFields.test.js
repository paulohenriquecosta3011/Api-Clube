import { validateRequiredFields } from '../../../src/middlewares/validateRequiredFields.js';
import { AppError } from '../../../src/utils/AppError.js';

describe('validateRequiredFields middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  it('deve chamar next() se todos os campos obrigatórios estiverem presentes', () => {
    req.body = {
      name: 'Paulo',
      email: 'paulo@example.com',
      password: '123456'
    };

    const middleware = validateRequiredFields(['name', 'email', 'password']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('deve lançar AppError se algum campo obrigatório estiver ausente', () => {
    req.body = {
      name: 'Paulo',
      password: '123456'
    };

    const middleware = validateRequiredFields(['name', 'email', 'password']);

    expect(() => middleware(req, res, next)).toThrow(AppError);
    expect(() => middleware(req, res, next)).toThrow('Os seguintes campos são obrigatórios: email');
  });

  it('deve listar múltiplos campos ausentes na mensagem de erro', () => {
    req.body = {
      password: '123456'
    };

    const middleware = validateRequiredFields(['name', 'email', 'password']);

    expect(() => middleware(req, res, next)).toThrow(AppError);
    expect(() => middleware(req, res, next)).toThrow('Os seguintes campos são obrigatórios: name, email');
  });
});
