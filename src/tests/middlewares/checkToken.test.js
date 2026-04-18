import jwt from 'jsonwebtoken';
import checkToken from '../../middlewares/checkToken.js';
import { AppError } from '../../utils/AppError.js';

// Mock do jwt.verify
jest.mock('jsonwebtoken');

let consoleErrorSpy;

// Silenciar console.error durante os testes
beforeAll(() => {
  consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation(() => {});
});

afterAll(() => {
  consoleErrorSpy.mockRestore();
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

  test('should return 401 if Authorization header is missing', () => {
    req.headers.authorization = undefined;

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Token not provided',
      code: 'TOKEN_NOT_PROVIDED',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if Authorization header does not start with Bearer', () => {
    req.headers.authorization = 'Token xyz';

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Token not provided',
      code: 'TOKEN_NOT_PROVIDED',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if jwt.verify throws TokenExpiredError', () => {
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
      message: 'Token expired',
      code: 'TOKEN_EXPIRED',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if jwt.verify throws JsonWebTokenError', () => {
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
      message: 'Invalid token',
      code: 'TOKEN_INVALID',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 if decoded token does not contain tipo_user', () => {
    req.headers.authorization = 'Bearer valid_token';

    jwt.verify.mockReturnValue({ sub: 123 });

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Malformed or invalid token',
      code: 'TOKEN_INVALID',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next and set req.user if token is valid', () => {
    req.headers.authorization = 'Bearer valid_token';

    const payload = { sub: 123, tipo_user: 'admin' };
    jwt.verify.mockReturnValue(payload);

    checkToken(req, res, next);

    expect(req.user).toEqual(payload);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  test('should return 500 if an unexpected error occurs', () => {
    req.headers.authorization = 'Bearer valid_token';

    jwt.verify.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal server error',
      code: 'SERVER_ERROR',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return custom AppError', () => {
    req.headers.authorization = 'Bearer valid_token';

    jwt.verify.mockImplementation(() => {
      throw new AppError('Custom error', 403, 'CUSTOM_ERROR', true);
    });

    checkToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: 'fail',
      message: 'Custom error',
      code: 'CUSTOM_ERROR',
    });
    expect(next).not.toHaveBeenCalled();
  });
});