// src/tests/utils/responseHandler.test.js
import { sendResponse } from '../../utils/responseHandler.js';

describe('sendResponse', () => {
  it('deve enviar resposta com status, mensagem e dados', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const statusCode = 200;
    const message = 'Operação bem-sucedida';
    const data = { id: 1, nome: 'Paulo' };

    sendResponse(res, statusCode, message, data);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message,
      data
    });
  });

  it('deve enviar resposta sem o campo data quando data é null', () => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    const statusCode = 204;
    const message = 'Sem conteúdo';

    sendResponse(res, statusCode, message);

    expect(res.status).toHaveBeenCalledWith(statusCode);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message
    });
  });
});
