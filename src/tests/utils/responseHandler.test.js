// src/tests/utils/responseHandler.test.js
import { sendResponse } from '../../utils/responseHandler.js';

describe('sendResponse', () => {
  it('should send response with status, message and data', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const statusCode = 200;
    const message = 'Operation successful';
    const data = { id: 1, name: 'Paulo' };

    sendResponse(res, statusCode, message, data);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message,
      data
    });
  });

  it('should send response with data as null when no data is provided', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const statusCode = 204;
    const message = 'No content';

    sendResponse(res, statusCode, message);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message,
      data: null
    });
  });
});