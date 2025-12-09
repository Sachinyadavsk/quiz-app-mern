import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/user.Route.js';
import resultRouter from './routes/result.Route.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// BD connection



// Routes
app.use('/api/vi/auth',userRouter);
app.use('api/vi/results',resultRouter);
// app.get('/', (req, res) => {
//     res.send('API is running...');
// });

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at port ${PORT}`);
});

