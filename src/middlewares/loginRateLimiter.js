import rateLimit from 'express-rate-limit';

const loginRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // padrão 15min
  max: parseInt(process.env.RATE_LIMIT_MAX) || 5,                        // padrão 5 tentativas  
  message: {
    status: 'fail',
    message: 'Muitas tentativas de login. Por favor, tente novamente após 15 minutos.',
  },
  standardHeaders: true, // retorna os cabeçalhos rate-limit info
  legacyHeaders: false, // desabilita os cabeçalhos X-RateLimit-*
});

export default loginRateLimiter;
