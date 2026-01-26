import path from 'node:path';
import { fileURLToPath } from 'node:url';
import swaggerJSDoc from 'swagger-jsdoc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apis = [
  path.resolve(__dirname, 'routes/*.js'),
  path.resolve(__dirname, 'models/*.js')
];

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'API Inventari', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }]
  },
  apis
});