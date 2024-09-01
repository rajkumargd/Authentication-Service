import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import AuthService from '../../src/services/authService';
import AuthController from '../../src/controllers/authController';
import Boom from '@hapi/boom';
import User from '../../src/models/userModels';


const app = express();
app.use(bodyParser.json());
 
jest.mock('../../src/services/authService');
 
const authServiceMock = new AuthService({} as any) as jest.Mocked<AuthService>;
 
const authController = new AuthController(authServiceMock);
 
app.post('/api/auth/register', authController.register.bind(authController));

// error handling middleware  
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (Boom.isBoom(err)) {
    return res.status(err.output.statusCode).json(err.output.payload);
  }
  res.status(500).json({ message: 'Internal Server Error' });
});

// Mock User model
const mockUser = {
  id: 1,
  username: 'testuser-1',
  password: 'password123',
  createdAt: new Date(), 
  updatedAt: new Date(),
} as User & { createdAt: Date; updatedAt: Date };
const mockUserResp = {
  id: 1,
  username: 'testuser-1',
  createdAt: new Date(),
  updatedAt: new Date(),
} as User & { createdAt: Date; updatedAt: Date };

describe('AuthController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('register a new user and return a 201 status', async () => {
    
    const username = 'testuser-1';
    const password = 'password123';

    authServiceMock.register.mockResolvedValue(mockUserResp);

    
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username, password });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: mockUser.id,
      username: mockUser.username,
      createdAt: mockUser.createdAt.toISOString(),
      updatedAt: mockUser.updatedAt.toISOString(),
    });
    expect(authServiceMock.register).toHaveBeenCalledWith(username, password);
  });

  it('return 409 if username already exists', async () => {
    
    const username = 'testuser-1';
    const password = 'password123';

    const conflictError = Boom.conflict('Username already exists');
    authServiceMock.register.mockRejectedValue(conflictError);

    
    const response = await request(app)
      .post('/api/auth/register')
      .send({ username, password });
     
    expect(response.status).toBe(409);
    expect(response.body).toEqual({
      statusCode: 409,
      error: 'Conflict',
      message: 'Username already exists'
    });
    expect(authServiceMock.register).toHaveBeenCalledWith(username, password);
  });
});