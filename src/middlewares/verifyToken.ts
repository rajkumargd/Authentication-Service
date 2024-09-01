import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Boom from '@hapi/boom';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return next(Boom.unauthorized('Authorization header is missing'));
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return next(Boom.unauthorized('Token is missing'));
  }

  try {
    const secret = process.env.JWT_SECRET || 'your_secret_key';
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return next(Boom.unauthorized('Invalid token'));
  }
};

export default verifyToken;