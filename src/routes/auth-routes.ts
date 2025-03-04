import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import '../models/User';

const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400).send({ error: 'Email and password are required' });
		return;
	}

	try {
		const user = new User({ email, password });
		await user.save();
		const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
		res.send({ token });
	} catch (err: any) {
		res.status(400).send(err.message);
	}
});

router.post('/signin', async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(400).send({ error: 'Email and password are required' });
		return;
	}

	const user = await User.findOne({ email });
	if (!user) {
		res.status(404).send({ error: 'User not found' });
		return;
	}

  try {
		await user.comparePassword(password);
		const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
		res.send({ token });
	} catch (err) {
		res.status(401).send({ error: 'Invalid email or password' });
		return;
	}
});

export default router;
