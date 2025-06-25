import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()
export const router = express.Router();
router.use(express.json())

//TODO: Function to check if user matches post author

//Get post of id
router.get('/posts/:id', async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            }
        })
        if (post) {
            const response = {
              ...post,
              time_created: post.time_created.toString(),
              time_sold: post.time_sold ? post.time_sold.toString() : null
            }
            res.status(200).json(response)
        } else {
            next({ status: 404, message: `No post found with ID ${postId}` })
        }
    }
    catch (err) {
        next(err)
    }
})

//Create a new post
router.post('/posts', async (req, res, next) => {
    const newPost = req.body;
    console.log(req.body);
    try {
        //check if post has all required fields
        const isNewPostValid = (
          newPost.price !== undefined &&
          newPost.category !== undefined &&
          newPost.name !== undefined &&
          newPost.time_created !== undefined &&
          newPost.location !== undefined &&
          newPost.authorId !== undefined
        )
        //create post
        if (isNewPostValid) {
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

//Get all users that liked post
router.get('/posts/:id/likes', async (req, res, next) => {
    const postId = req.params.id;
    try {
        const user = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            },
            include: {
                User_UserLikedPosts: true
            }
        })
        const usersLiked = user.User_UserLikedPosts;
        res.status(200).json(usersLiked);
    }
    catch (err) {
        next(err)
    }
})
