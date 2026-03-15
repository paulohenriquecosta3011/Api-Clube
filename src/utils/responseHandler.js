// utils/responseHandler.js
export function sendResponse(res, statusCode, message, responsePayload = null) {
  const status = statusCode >= 400 ? 'fail' : 'success';

  return res.status(statusCode).json({
    status,
    message,
    data: responsePayload
  });
}