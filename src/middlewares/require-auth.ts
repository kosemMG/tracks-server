import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { NextFunction, Request, Response } from 'express';

const User = mongoose.model('User');

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).send({ error: 'Unauthorized' });
    return;
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, 'MY_SECRET_KEY', async (err: VerifyErrors | null, payload: JwtPayload | string | undefined) => {
    if (err || !payload) {
      res.status(401).send({ error: 'Unauthorized' });
      return;
    }

    const { userId } = payload as JwtPayload;
    req.user = await User.findById(userId);
    if (!req.user) {
      res.status(404).send({ error: 'User not found' });
      return;
    }

    next();
  });
}