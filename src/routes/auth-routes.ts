import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import '../models/User';

const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
    res.send({ token });
  } catch (err: any) {
    res.status(400).send(err.message);
  }

});

export default router;
