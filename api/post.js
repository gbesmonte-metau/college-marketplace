import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()
export const router = express.Router();
router.use(express.json())

//TODO: CURRENTLY NOT TESTED
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
