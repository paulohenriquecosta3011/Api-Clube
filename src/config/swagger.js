import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const baseOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ClubeUva API',
      version: '1.0.0',
      description: 'API for managing users, invitations, and guests.',
    },
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
  apis: ['./src/routes/*.js'],
};

export const swaggerDocs = (app) => {
  const swaggerSpec = swaggerJSDoc({
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      servers: [
        {
          url: process.env.BASE_URL || 'http://localhost:3001',
          description: 'API server',
        },
      ],
    },
  });

  console.log('BASE_URL:', process.env.BASE_URL);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log('Swagger docs available at /api-docs');
};