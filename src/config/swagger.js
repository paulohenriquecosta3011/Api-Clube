import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const baseOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ACCESS API',
      version: '1.0.0',
      description:
        'REST API for access control, guest management, invitations, QRCode validation and gate synchronization.',
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

    security: [
      {
        bearerAuth: [],
      },
    ],
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

          description: isProd
            ? 'Production Server (VPS)'
            : 'Development Server (Local)',
        },
      ],
    },
  });

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
  );

  console.log('Swagger docs available at /api-docs');
};