import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import authRoutes from './routes/auth-routes';
import requireAuth from './middlewares/require-auth';

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);

const port = 3000;

const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0.kvcid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri);
mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected');
});
mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB', err);
});

app.get('/', requireAuth, (req: Request, res: Response) => {
  res.send(`Your email: ${req.user?.email}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});