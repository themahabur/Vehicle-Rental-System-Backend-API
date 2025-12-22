import express from 'express';
import { userRoutes } from './modules/users/user.routes';

const app = express();

app.use(express.json());

app.use('/api/v1/users', userRoutes);

app.get('/api/v1/', (req, res) => {
  res.send('Hello, in the API v1!');
});

export default app;