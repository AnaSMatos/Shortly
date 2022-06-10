import {Router} from 'express';
import {getUsers, ranking} from '../controllers/usersController.js';

const usersRouter = Router();

usersRouter.get('/users/:id', getUsers);
usersRouter.get('/ranking', ranking);

export default usersRouter;