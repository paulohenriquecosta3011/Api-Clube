// utils/AppError.js

// Classe personalizada que estende a classe de erro nativa do JavaScript.
// Serve para facilitar o tratamento de erros operacionais em APIs REST.

export class AppError extends Error {
  /**
   * @param {string} message - Mensagem do erro (obrigatória)
   * @param {number} statusCode - Código HTTP (ex: 400, 404, 500). Default: 400
   * @param {string} [code] - Código interno opcional (ex: 'USER_NOT_FOUND')
   * @param {boolean} [isOperational] - Define se o erro é operacional ou inesperado. Default: true
   */
  constructor(message, statusCode = 400, code = null, isOperational = true) {
    super(message); // Chama o construtor de Error para setar a mensagem de erro

    this.statusCode = statusCode; // Usado no res.status(...)
    
    // Define status textual: 'fail' para 4xx e 'error' para 5xx
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    this.code = code; // Código opcional de erro (útil para frontend ou logs)
    this.isOperational = isOperational; // Marca se é um erro operacional controlado

    // Captura o stack trace omitindo este construtor da pilha
    Error.captureStackTrace(this, this.constructor);
  }
}
