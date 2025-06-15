import crypto from 'node:crypto';
import { userModel } from '../models/userModels.js';
import { sessionModel } from '../models/sessionModels.js';
import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

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
    throw new createHttpError.Unauthorized('Email or password is incorrect');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch !== true) {
    throw new createHttpError.Unauthorized('Email or password is incorrect');
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
