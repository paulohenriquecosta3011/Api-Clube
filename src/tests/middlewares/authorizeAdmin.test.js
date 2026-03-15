import { authorizeAdmin } from '../../middlewares/authMiddleware.js';
import { AppError } from '../../utils/AppError.js';

describe('authorizeAdmin middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};
    res = {};
    next = jest.fn();
  });

  it('should call next() without arguments if req.user.tipo_user is "A"', () => {
    req.user = { tipo_user: 'A' };
    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with AppError if req.user is missing', () => {
    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('Access denied. Admins only.');
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
    expect(err.isOperational).toBe(true);
  });

  it('should call next with AppError if req.user.tipo_user is not "A"', () => {
    req.user = { tipo_user: 'U' };
    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    const err = next.mock.calls[0][0];
    expect(err).toBeInstanceOf(AppError);
    expect(err.message).toBe('Access denied. Admins only.');
    expect(err.statusCode).toBe(403);
    expect(err.code).toBe('FORBIDDEN');
    expect(err.isOperational).toBe(true);
  });
});