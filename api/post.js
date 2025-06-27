import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js'

const prisma = new PrismaClient()
export const router = express.Router();
router.use(express.json())

//Auth check middleware
function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else {
        res.status(401).json({ message: 'User not authenticated' })
    }
}

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

//Get all posts (+ query)
router.get('/posts', async (req, res, next) => {
    try {
        const whereClause = {};
        //price
        if (req.query.price != 'undefined') {
            whereClause.price = { lte: parseFloat(req.query.price) };
        }
        //mutiple categories
        if (Array.isArray(req.query.category)) {
            const categories = req.query.category.map(Number);
            whereClause.category = { in: categories };
        }
        //one category
        else if (req.query?.category){
            whereClause.category = parseInt(req.query.category);
        }
        //search
        if (req.query.search) {
            whereClause.OR = [
                { name: { contains: req.query.search } },
                { description: { contains: req.query.search } },
            ]
        }
        const posts = await prisma.post.findMany({
            where: whereClause
        })
        if (posts.length > 0) {
            res.status(200).json(posts)
        } else {
            next({ status: 404, message: 'No posts found' })
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

//Get all posts a user Authored
router.get('/authored', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    try {
        const posts = await prisma.post.findMany({
            where: {
                authorId: parseInt(userId)
            }
        })
        if (posts.length > 0) {
            res.status(200).json(posts)
        } else {
            next({ status: 404, message: `No posts found with user ID ${userId}` })
        }
    }
    catch (err) {
        next(err)
    }
})

//Delete a post
router.delete('/posts/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id
    const postId = req.params.id;
    try {
        const getPost = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            }
        })
        if (!getPost) {
            next({ status: 404, message: `No post found with ID ${postId}` });
            return;
        }
        if (getPost.authorId !== userId) {
            next({ status: 403, message: `You are not the author of this post` });
            return;
        }
        const deletedPost = await prisma.post.delete({
            where: {
                id: parseInt(postId)
            }
        })
        if (deletedPost) {
            res.status(200).json(deletedPost)
        } else {
            next({ status: 404, message: `No post found with ID ${postId}` })
        }
    }
    catch (err) {
        next(err)
    }
})

//TODO: NOT TESTED
//Edit a post
router.patch('/posts/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id
    const postId = req.params.id;
    const updatedFields = req.body;
    try {
        const getPost = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            }
        })
        if (!getPost) {
            next({ status: 404, message: `No post found with ID ${postId}` });
            return;
        }
        if (getPost.authorId !== userId) {
            next({ status: 403, message: `You are not the author of this post` });
            return;
        }
        const newPost = await prisma.post.update({
            where: {
                id: parseInt(userId)
            },
            data: updatedFields
        });
        if (newPost) {
            res.status(200).json(newPost)
        } else {
            next({ status: 404, message: `No post found with ID ${postId}` })
        }
    } catch (err) {
        next(err)
    }
})
