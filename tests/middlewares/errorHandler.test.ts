import express from 'express';
import request from 'supertest';
import errorHandler from '../../src/middlewares/errorHandler';
import Boom from '@hapi/boom';

import { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json()); 

app.get('/error', (req: Request, res: Response, next: NextFunction) => {
  next(new Error('Test error'));
});

app.get('/boom-error', (req: Request, res: Response, next: NextFunction) => {
  next(Boom.badRequest('Boom bad request error'));
});

app.use(errorHandler);

describe('Error Handling Middleware', () => {
  it('should handle Boom errors', async () => {
    const response = await request(app)
      .get('/boom-error')
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Boom bad request error'
    });
  });

  it('general errors', async () => {
    const response = await request(app).get('/error');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    });
  });
});