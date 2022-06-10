import {Router} from 'express';
import {signUp, signIn} from '../controllers/authController.js';
import {auth} from '../middlewares/auth.js';

const authRouter = Router();

authRouter.post('/signup', auth, signUp);
authRouter.post('/signin', signIn);

export default authRouter;