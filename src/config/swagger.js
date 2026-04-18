import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const baseOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API FOR CLUB',
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
          url: 'http://localhost:3001/api/v1',
          description: 'Local (VMWare)',
        },
        {
          url: process.env.VPS_URL || 'http://159.89.38.138:3001/api/v1',
          description: 'Production (VPS)',
        },
      ],
    },
  });

  console.log('BASE_URL:', process.env.BASE_URL);

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log('Swagger docs available at /api-docs');
};