import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';

import productsRouter from './routes/products.routes.js';
import notFound from './middlewares/not-found.js';
import errorHandler from './middlewares/error-handler.js';
import categoriesRouter from './routes/categories.routes.js';
const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/categories', categoriesRouter);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/products', productsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;