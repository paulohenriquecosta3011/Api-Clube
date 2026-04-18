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
  const isProd = process.env.NODE_ENV === 'production';

  const swaggerSpec = swaggerJSDoc({
    ...baseOptions,
    definition: {
      ...baseOptions.definition,
      servers: [
        {
          url: isProd
            ? 'http://159.89.38.138:3001/api/v1'
            : 'http://localhost:3001/api/v1',
          description: isProd ? 'Production (VPS)' : 'Local (VMWare)',
        },
      ],
    },
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  console.log(`Swagger docs available at /api-docs`);
};