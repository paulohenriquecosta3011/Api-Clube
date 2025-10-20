import jwt from 'jsonwebtoken';
import checkToken from '../../middlewares/checkToken.js';
import { AppError } from '../../utils/AppError.js';

// Mock do jwt.verify
jest.mock('jsonwebtoken');

// Silenciar console.error durante os testes
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
});
describe('Middleware checkToken', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  test('Deve retornar 401 se o header Authorization não existir', () => {
    req.headers.authorization = undefined;

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Token não fornecido',
      code: 'TOKEN_NAO_FORNECIDO',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar 401 se o header Authorization não começar com Bearer', () => {
    req.headers.authorization = 'Token xyz';

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Token não fornecido',
      code: 'TOKEN_NAO_FORNECIDO',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar 401 se jwt.verify lançar TokenExpiredError', () => {
    req.headers.authorization = 'Bearer token_invalido';

    jwt.verify.mockImplementation(() => {
      const err = new Error('jwt expired');
      err.name = 'TokenExpiredError';
      throw err;
    });

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Token expirado',
      code: 'TOKEN_EXPIRADO',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar 401 se jwt.verify lançar JsonWebTokenError', () => {
    req.headers.authorization = 'Bearer token_invalido';

    jwt.verify.mockImplementation(() => {
      const err = new Error('jwt malformed');
      err.name = 'JsonWebTokenError';
      throw err;
    });

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Token inválido',
      code: 'TOKEN_INVALIDO',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar 401 se token decodificado não tiver tipo_user', () => {
    req.headers.authorization = 'Bearer valid_token';

    jwt.verify.mockReturnValue({ sub: 123 });

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Token malformado ou inválido',
      code: 'TOKEN_INVALIDO',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve chamar next e setar req.user se token for válido', () => {
    req.headers.authorization = 'Bearer valid_token';

    const payload = { sub: 123, tipo_user: 'admin' };
    jwt.verify.mockReturnValue(payload);

    checkToken(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('Deve retornar 500 se lançar erro inesperado', () => {
    req.headers.authorization = 'Bearer valid_token';

    jwt.verify.mockImplementation(() => {
      throw new Error('Erro inesperado');
    });

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Erro interno no servidor',
      code: 'SERVER_ERROR',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('Deve retornar erro customizado do AppError', () => {
    req.headers.authorization = 'Bearer valid_token';

    jwt.verify.mockImplementation(() => {
      throw new AppError('Erro customizado', 403, 'ERRO_CUSTOM', true);
    });

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Erro customizado',
      code: 'ERRO_CUSTOM',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
