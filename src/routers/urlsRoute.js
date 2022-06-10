import {Router} from 'express';
import {postUrls, getUrl, openUrl, deleteUrl} from '../controllers/urlsController.js';
import {url} from '../middlewares/url.js';

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', url, postUrls);
urlsRouter.get('/urls/:id', getUrl);
urlsRouter.get('/urls/open/:shortUrl', openUrl);
urlsRouter.delete('/urls/:id', deleteUrl);


export default urlsRouter;