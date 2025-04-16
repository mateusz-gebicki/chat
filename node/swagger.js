const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Chat API',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

function setupSwagger(app) {
    app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;