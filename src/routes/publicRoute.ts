import { Router } from 'express';
import { authController } from '../controllers/authController';

const publicRouter = Router();

publicRouter.post('/auth/register', authController.register.bind(authController));
publicRouter.post('/auth/login', authController.login.bind(authController));

export default publicRouter;
