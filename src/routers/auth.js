import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  registerSchema,
  loginSchema,
  sendResetPasswordSchema,
  resetPasswordSchema,
  confirmOauthSchema,
} from '../validation/auth.js';
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
  sendResetPasswordController,
  resetPasswordController,
  getOauthController,
  confirmOauthController,
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

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post(
  '/send-reset-email',
  jsonParser,
  validateBody(sendResetPasswordSchema),
  ctrlWrapper(sendResetPasswordController)
);

authRouter.post(
  '/reset-pwd',
  jsonParser,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController)
);

authRouter.get('/get-oauth-url', ctrlWrapper(getOauthController));

authRouter.post(
  '/confirm-oauth',
  jsonParser,
  validateBody(confirmOauthSchema),
  ctrlWrapper(confirmOauthController)
);

export default authRouter;
