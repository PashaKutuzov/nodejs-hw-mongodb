import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from '../controllers/authController.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
// import router from './contacts.js';
const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController)
);

authRouter.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController)
);

authRouter.post('/logout', ctrlWrapper(logoutController));

export default authRouter;

authRouter.post('/refresh', ctrlWrapper(refreshController));
