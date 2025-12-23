import express from 'express';
import { userRoutes } from './modules/users/user.routes';
import { authRoutes } from './modules/auth/auth.routes';

const app = express();

app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);


app.get('/api/v1/', (req, res) => {
  res.send('Hello, in the API v1!');
});

export default app;