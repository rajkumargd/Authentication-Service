import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
import Boom from '@hapi/boom';
import UserRepository from '../repositories/userRepository';

export default class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }
  //TODO: DTO to be implemented with class-validator
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    try {
      const { username, password } = req.body;
      const user = await this.authService.register(username, password);
      //TODO: Response RO to be implemented
      res.status(201).json(user);
    } catch (err) {
      if (!Boom.isBoom(err)) {
        next(Boom.boomify(err as Error));
      } else {
        next(err);
      }
    }
  }
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
     
      const { username, password } = req.body;
      const response = await this.authService.login(username, password);

      //TODO: Response RO to be implemented
      res.status(200).json(response); 
    } catch (error) {
      next(error);
    }
  }
  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Since it is stateless JWT, just inform the client to delete the token
      // We can log the request for our tracking
      //TODO: Response RO to be implemented
      res.status(200).send({message:'Logged out successfully'});
    } catch (err) {
      next(err);
    }
  }
  
}

//this is followed for Repository Patern
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
export const authController = new AuthController(authService);
