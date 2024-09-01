import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';
import logger from '../config/logger';

const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err); 
  }
  
  if (Boom.isBoom(err)) {
    //  Boom errors resp
    logger.error(`${err.output.payload.message} ${err.stack}`);
    return res.status(err.output.statusCode).json(err.output.payload);
  }

  if (err instanceof SyntaxError && 'status' in err && err.status === 400) {
    logger.error(`Syntax Error: ${err.message}`);
    return res.status(400).json({ 
      statusCode: 400,
      error: 'Bad Request',
      message: 'Invalid'
    });
  }

  // unexpected errors
  const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
  logger.error(`Unexpected Error: ${errorMessage}`);

  return res.status(500).json({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
};

export default errorHandler;