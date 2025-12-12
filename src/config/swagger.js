const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle App API',
      version: '1.0.0',
      description: 'API documentation for the Vehicle Community App',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    // YENİ EKLENEN KISIM: Güvenlik Şeması Tanımı
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    // İsteğe bağlı: Tüm rotalarda kilit ikonunu varsayılan olarak açmak isterseniz:
    /*
    security: [
      {
        bearerAuth: [],
      },
    ],
    */
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;