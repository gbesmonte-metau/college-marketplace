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
            res.status(200).json(post)
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
          res.status(201).json(created)
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
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            },
            include: {
                User_UserLikedPosts: true
            }
        })
        const usersLiked = post.User_UserLikedPosts;
        if (usersLiked){
          res.status(200).json(usersLiked);
        }
        else{
          next({ status: 404, message: `No users liked post with ID ${postId}` })
        }
    }
    catch (err) {
        next(err)
    }
})

//Get all users that saved post
router.get('/posts/:id/saves', async (req, res, next) => {
  const postId = req.params.id;
  try {
      const post = await prisma.post.findUnique({
          where: {
              id: parseInt(postId)
          },
          include: {
              User_UserSavedPosts: true
          }
      })
      const usersSaved = post.User_UserSavedPosts;
      if (usersSaved){
        res.status(200).json(usersSaved);
      }
      else{
        next({ status: 404, message: `No users saved post with ID ${postId}` })
      }
  }
  catch (err) {
      next(err)
  }
})
