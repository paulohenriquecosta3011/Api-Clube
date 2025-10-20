// utils/responseHandler.js

export function sendResponse(res, statusCode, message, data = null) {
    const responsePayload = {
      status: 'success',
      message,
    };
  
    if (data !== null) {
      responsePayload.data = data;
    }
  
    return res.status(statusCode).json(responsePayload);
  }
  