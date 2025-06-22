import * as fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/userModels.js';
import { sessionModel } from '../models/sessionModels.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { sendEmail } from '../utils/sendEmail.js';

const RESET_PASSWORD_TEMPLATE = fs.readFileSync(
  path.resolve('src', 'templates', 'reset-password.hbs'),
  'UTF-8'
);

console.log(RESET_PASSWORD_TEMPLATE);

export async function registerUser(payload) {
  const user = await userModel.findOne({ email: payload.email });
  if (user !== null) {
    throw new createHttpError.Conflict('Email in use');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return userModel.create(payload);
}

export async function loginUser(email, password) {
  const user = await userModel.findOne({ email });
  if (user === null) {
    throw new createHttpError.Unauthorized('Email is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Password is incorrect');
  }

  const accessToken = crypto.randomBytes(30).toString('base64');
  const refreshToken = crypto.randomBytes(30).toString('base64');

  return sessionModel.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 60 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function logoutUser(sessionId) {
  await sessionModel.deleteOne({ _id: sessionId });
}

export async function refreshUser(sessionId, refreshToken) {
  const session = await sessionModel.findOne({ _id: sessionId });
  if (session === null) {
    throw new createHttpError.Unauthorized('Session not found');
  }
  if (session.refreshToken !== refreshToken) {
    throw new createHttpError.Unauthorized('Refresh token is invalid');
  }
  if (session.refreshTokenValidUntil < new Date()) {
    throw new createHttpError.Unauthorized('Refresh token time out');
  }
  await sessionModel.deleteOne({ _id: session._id });

  return sessionModel.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 60 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}

export async function sendResetPassword(email) {
  try {
    const user = await userModel.findOne({ email });

    if (user === null) {
      throw new createHttpError.NotFound('User not found!');
    }
    const token = jwt.sign(
      {
        sub: user._id,
        name: user.name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );
    const template = Handlebars.compile(RESET_PASSWORD_TEMPLATE);

    await sendEmail(
      user.email,
      'Reset password',
      template({
        link: `http://localhost:3000/auth/reset-password/?token=${token}`,
      })
    );
  } catch (err) {
    console.error('Error:', err);
  }
}

export async function ResetPassword(password, token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.sub);

    if (user === null) {
      throw new createHttpError.NotFound('User not found');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new createHttpError.Unauthorized('Token is unauthorized');
    }
    if (error.name === 'TokenExpiredError') {
      throw new createHttpError.Unauthorized('Token is expired');
    }
    throw error;
  }
}

export async function loginOrRegister(email, name) {
  let user = await userModel.findOne({ email });
  if (user === null) {
    const password = await bcrypt.hash(
      crypto.randomBytes(30).toString('base64'),
      10
    );
    await userModel.create({ name, user, password });
  }

  await sessionModel.deleteOne({ userId: user._id });
  return sessionModel.create({
    userId: user._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + 60 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
}
