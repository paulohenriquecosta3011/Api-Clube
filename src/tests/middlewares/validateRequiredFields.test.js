import { validateRequiredFields } from '../../../src/middlewares/validateRequiredFields.js';
import { AppError } from '../../../src/utils/AppError.js';

describe('validateRequiredFields middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    next = jest.fn();
  });

  it('should call next() if all required fields are present', () => {
    req.body = {
      name: 'Paulo',
      email: 'paulo@example.com',
      password: '123456'
    };

    const middleware = validateRequiredFields(['name', 'email', 'password']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('should throw AppError if a required field is missing', () => {
    req.body = {
      name: 'Paulo',
      password: '123456'
    };

    const middleware = validateRequiredFields(['name', 'email', 'password']);

    expect(() => middleware(req, res, next)).toThrow(AppError);
    expect(() => middleware(req, res, next)).toThrow('The following fields are required: email');
  });

  it('should list multiple missing fields in the error message', () => {
    req.body = {
      password: '123456'
    };

    const middleware = validateRequiredFields(['name', 'email', 'password']);

    expect(() => middleware(req, res, next)).toThrow(AppError);
    expect(() => middleware(req, res, next)).toThrow('The following fields are required: name, email');
  });
});