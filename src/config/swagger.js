const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Motohanem API',
      version: '1.0.0',
      description: 'API documentation for the Motohanem Project',
    },
    servers: [
      {
        // CANLI ORTAM AYARI: İsteklerin sunucuya gitmesini sağlar
        url: 'https://motohanem.site',
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
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
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;