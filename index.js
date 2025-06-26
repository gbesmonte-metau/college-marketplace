import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {router as userRouter} from './api/user.js';
import {router as postRouter} from './api/post.js';
import expressSession from 'express-session';

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(cors(
    {credentials: true, origin: 'http://localhost:5173'}
));
app.use(expressSession({
    name: 'cookie',
    cookie: { path: '/', httpOnly: false, secure: false, maxAge: 600000 },
    secret: 'temporary secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(userRouter);
app.use(postRouter);

app.get('/', (req, res) => {
    res.send('Welcome to my app!')
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})

// [CATCH-ALL]
app.use('/*', (req, res, next) => {
    next({ status: 404, message: 'Not found' })
})

// Error handling middleware
app.use((err, req, res, next) => {
    const { message, status = 500 } = err
    res.status(status).json({ message })
})
