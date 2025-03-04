import express, { Request, Response } from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

const mongoUri = 'mongodb+srv://admin:passwordpassword@cluster0.kvcid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoUri);
mongoose.connection.on('connected', () => {
	console.log('MongoDB Connected');
});
mongoose.connection.on('error', (err) => {
	console.error('Error connecting to MongoDB', err);
})

app.get('/', (req: Request, res: Response) => {
	res.send('Hello, TypeScript!');
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});