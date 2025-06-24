import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma/index.js'
import cors from 'cors';

const prisma = new PrismaClient()
dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;
app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to my app!')
})

//Register a new user
//TODO: password hashing
app.post('/users', async (req, res, next) => {
    const newUser = req.body;
    try {
        //check if user has all required fields
        const newUserValid = (
          newUser.email !== undefined &&
          newUser.password !== undefined &&
          newUser.username !== undefined
        )
        //check if username or email is taken
        const userExists = await prisma.user.findMany({
            where: {
                OR: [
                    { email: newUser.email },
                    { username: newUser.username }
                ]
            }
        })
        if (userExists) {
          next({ status: 409, message: 'Username or email already exists' })
          return;
        }
        //create user
        if (newUserValid) {
          const created = await prisma.user.create({data:newUser})
          res.status(201).json(created)
        } else {
          next({ status: 422, message: 'New user is not valid' })
        }
      } catch (err) {
        next(err)
      }
})

//Create a new post
app.post('/posts', async (req, res, next) => {
    const newPost = req.body;
    console.log(req.body);
    try {
        //check if post has all required fields
        const newPostValid = (
          newPost.price !== undefined &&
          newPost.category !== undefined &&
          newPost.name !== undefined &&
          newPost.time_created !== undefined &&
          newPost.location !== undefined &&
          newPost.authorId !== undefined
        )
        //create post
        if (newPostValid) {
          const created = await prisma.post.create({data:newPost})
          // Convert BigInt fields to strings for JSON serialization
          const response = {
            ...created,
            time_created: created.time_created.toString(),
            time_sold: created.time_sold ? created.time_sold.toString() : null
          }
          res.status(201).json(response)
        } else {
          next({ status: 422, message: 'New post is not valid' })
        }
      } catch (err) {
        next(err)
      }
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
