import createHttpError from 'http-errors';
// import mongoose from 'mongoose';
import { sessionModel } from '../models/sessionModels.js';
import { userModel } from '../models/userModels.js';
export default async function auth(req, res, next) {
  const { authorization } = req.headers;
  if (typeof authorization !== 'string') {
    return next(
      new createHttpError.Unauthorized(
        'Please provide access token (not string)'
      )
    );
  }
  const [bearer, accessToken] = authorization.split(' ', 2);

  if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
    return next(
      new createHttpError.Unauthorized(
        'Please provide access token (no bear or accessToken not string)'
      )
    );
  }
  const session = await sessionModel.findOne({ accessToken });

  if (session === null) {
    return next(
      new createHttpError.Unauthorized(
        'Please provide access token (session === null)'
      )
    );
  }
  if (session.accessTokenValidUntil < new Date()) {
    return next(new createHttpError.Unauthorized('Token is expired'));
  }
  // const user = await userModel.findOne({
  //   _id: new mongoose.Types.ObjectId(session.userId),
  // });
  const user = await userModel.findById(session.userId);
  if (user === null) {
    return next(
      new createHttpError.Unauthorized(
        'Please provide access token (user === null)'
      )
    );
  }

  req.user = await userModel.findOne({ _id: session.userId });
  // req.user = user;
  // req.sessionId = session._id;
  next();
}
