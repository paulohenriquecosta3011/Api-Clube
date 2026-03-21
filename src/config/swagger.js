// src/config/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClubeUva API',
      version: '1.0.0',
      description: 'API for managing users, invitations, and guests.',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3001',
        description: 'API server',        
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // todos os arquivos de rota
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger docs available at http://localhost:3001/api-docs');
};