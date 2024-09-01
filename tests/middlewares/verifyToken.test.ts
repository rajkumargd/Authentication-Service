import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import verifyToken from '../../src/middlewares/verifyToken';
import Boom from '@hapi/boom';

const app = express();
app.use(express.json());


app.get('/protected', verifyToken, (req, res) => {
  res.status(200).send('Protected route');
});

// create error handler middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (Boom.isBoom(err)) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  res.status(500).json({ error: 'Internal Server Error' });
});

describe('verifyToken Middleware', () => {
  const secret = process.env.JWT_SECRET || 'your_secret_key';

  it('return 401 if no token is provided', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Authorization header is missing',
    });
  });

  it('return 401 if an token is invalid', async () => {
    const invalidToken = 'invalidtoken';
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Invalid token',
    });
  });

  it('allow access if a valid token is provided', async () => {
    const payload = { userId: 1 };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Protected route');
  });
});