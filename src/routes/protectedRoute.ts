import { Router } from 'express';
import { authController } from '../controllers/authController';

const protectedRouter = Router();
protectedRouter.post('/auth/logout', authController.logout.bind(authController));

export default protectedRouter;
