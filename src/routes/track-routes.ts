import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

import requireAuth from '../middlewares/require-auth';
import '../models/Track';

const Track = mongoose.model('Track');

const router = express.Router();
router.use(requireAuth);

router.get('/tracks', async (req: Request, res: Response) => {
	const tracks = await Track.find({ userId: req.user?._id });
	res.send(tracks);
});

router.post('/tracks', async (req: Request, res: Response) => {
	const { name, locations } = req.body;
	if (!name || !locations) {
		res.status(400).send({ error: 'Missing name or locations' });
		return;
	}

	try {
		const track = new Track({ name, locations, userId: req.user?._id });
		await track.save();
		res.send(track);
	} catch (err: any) {
		res.status(422).send({ error: err.message });
	}

});

export default router;
