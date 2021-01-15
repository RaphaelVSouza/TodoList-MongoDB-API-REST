import { Router } from 'express';
import ExpressBrute from 'express-brute';
import RedisStore from 'express-brute-redis';

import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from 'swagger-jsdoc';
import multer from 'multer';

import UserController from './app/controllers/UserController';
import AvatarController from './app/controllers/AvatarController';
import SessionController from './app/controllers/SessionController';
import PasswordController from './app/controllers/PasswordController';
import ProjectController from './app/controllers/ProjectController';
import TaskController from './app/controllers/TaskController';
import UserMailController from './app/controllers/UserMailController';

import validateUserStore from './app/validators/UserStore';
import validateUserUpdate from './app/validators/UserUpdate';
import validatePasswordStore from './app/validators/PasswordStore';
import validatePasswordUpdate from './app/validators/PasswordUpdate';
import validateSessionStore from './app/validators/SessionStore';
import validateProjectStore from './app/validators/ProjectStore';
import validateProjectUpdate from './app/validators/ProjectUpdate';
import validateProjectIndex from './app/validators/ProjectIndex';

import redisConfig from './config/redis';
import multerConfig from './config/multer';
import swaggerOptions from '../documentation/docSwagger';
import { retries } from './config/brute';
import errorMiddleware from './app/middlewares/error';

const store = new RedisStore(redisConfig);

const jwtConfig = ['jwt', { session: false }];

const bruteforce = new ExpressBrute(store, { freeRetries: retries });

const routes = new Router();

const specs = swaggerDocs(swaggerOptions);

routes.use('/docs', swaggerUi.serve);

routes.get('/', (req, res) => {
  res.send('API is running')
})

routes.get(
  '/docs',
  swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none !important }',
    customSiteTitle: 'TodoList | Documentation',
  }),
);

routes.post(
  '/register',
  multer(multerConfig).single('file'),
  validateUserStore,
  UserController.store,
);

routes.post('/login', bruteforce.prevent, validateSessionStore, SessionController.store);

routes.delete(
  '/:avatarId/deletePhoto',
  passport.authenticate(...jwtConfig),
  AvatarController.delete,
);

routes.get('/verify-email/:verifyToken', UserMailController.verifyEmail);
//routes.post('/verify-email/re-send', UserMailController.reSendVerifyMail);

routes.post('/forgot-password', validatePasswordStore, PasswordController.store);
routes.put('/reset-password/:resetToken', validatePasswordUpdate, PasswordController.update);

routes.put(
  '/user-management/edit-account',
  passport.authenticate(...jwtConfig),
  multer(multerConfig).single('file'),
  validateUserUpdate,
  UserController.update,
);

routes.delete(
  '/user-management/delete-account',
  passport.authenticate(...jwtConfig),
  validateUserUpdate,
  UserController.delete,
);

routes.post(
  '/my-projects/create-project',
  validateProjectStore,
  passport.authenticate(...jwtConfig),
  ProjectController.store,
);

routes.get(
  '/my-projects/all-projects',
  passport.authenticate(...jwtConfig),
  validateProjectIndex,
  ProjectController.index,
);

routes.get(
  '/my-projects/:projectId/tasks',
  passport.authenticate(...jwtConfig),
  ProjectController.show,
);
routes.put(
  '/my-projects/:projectId/edit',
  validateProjectUpdate,
  passport.authenticate(...jwtConfig),
  ProjectController.update,
);
routes.delete(
  '/my-projects/:projectId/delete',
  passport.authenticate(...jwtConfig),
  ProjectController.delete,
);

routes.put(
  '/projects/:projectId/tasks/:taskId/edit',
  passport.authenticate(...jwtConfig),
  TaskController.update,
);

routes.delete(
  '/projects/:projectId/tasks/:taskId/delete',
  passport.authenticate(...jwtConfig),
  TaskController.delete,
);

routes.use(errorMiddleware);

export default routes;
