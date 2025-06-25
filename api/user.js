import express from 'express';
import { PrismaClient } from '../generated/prisma/index.js'
import { hashPassword, verifyPassword } from './bcrypt.js';

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
//USER ENDPOINTS
//Get the user information of the currently authenticated user
router.get('/user', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        })
        if (user) {
            res.status(200).json(user)
        } else {
            next({ status: 404, message: `No user found with ID ${userId}` })
        }
    }
    catch (err) {
        next(err)
    }
})
//Get all posts that user liked
router.get('/user/:id/likes', async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            },
            include: {
                Post_UserLikedPosts: true
            }
        })
        const likedPosts = user.Post_UserLikedPosts;
        let result = [];
        for (const post of likedPosts){
            result.push({
                ...post,
              time_created: post.time_created.toString(),
              time_sold: post.time_sold ? post.time_sold.toString() : null
            })
        }
        res.status(200).json(result);
    }
    catch (err) {
        next(err)
    }
})
//Get user information by ID
router.get('/user/:id', async (req, res, next) => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            }
        })
        if (user) {
            res.status(200).json(user)
        } else {
            next({ status: 404, message: `No user found with ID ${userId}` })
        }
    }
    catch (err) {
        next(err)
    }
})

//Register a new user
router.post('/user/register', async (req, res, next) => {
    const newUser = req.body;
    console.log(newUser)
    try {
        //check if user has all required fields
        const isNewUserValid = (
          newUser.email !== undefined &&
          newUser.password !== undefined &&
          newUser.username !== undefined
        )
        if (!isNewUserValid) {
          next({ status: 422, message: 'New user is not valid' })
        }
        //check if username or email is taken
        const userExists = await prisma.user.findMany({
            where: {
                OR: [
                    { email: newUser.email },
                    { username: newUser.username }
                ]
            }
        })
        if (userExists.length > 0) {
          next({ status: 409, message: 'Username or email already exists' })
          return;
        }
        //hash password
        const hash = await hashPassword(newUser.password)
        //create user
        const created = await prisma.user.create({
            data: {...newUser, password: hash}
        })
        res.status(201).json(created)
      } catch (err) {
        next(err)
      }
})

//Login user
router.post('/user/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({where: {email}});
    if (user) {
        const isValid = await verifyPassword(password, user.password);
        if (isValid) {
            req.session.user = user;
            console.log(req.session)
            res.status(200).json({message: 'Login successful'});
        } else {
            next({ status: 401, message: 'Invalid credentials' });
        }
    }
    else{
        next({ status: 401, message: 'Invalid credentials' });
    }
})

//Logout user
router.post('/user/logout', isAuthenticated, (req, res, next) => {
    req.session.user = null;
    res.json({ message: 'Logout successful' });
})

//Edit user profile
router.patch('/user', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id
    const updatedFields = req.body;
    try {
        const newUser = await prisma.user.update({
            where: {
                id: parseInt(userId)
            },
            data: updatedFields
        });

        if (newUser) {
            res.status(200).json(newUser)
        } else {
            next({ status: 404, message: `No user found with ID ${userId}` })
        }
    } catch (err) {
        next(err)
    }
})

//Like a post
router.post('/user/likes/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    const postId = req.params.id;
    try {
        await prisma.user.update({
            where: {id: userId},
            data: {
                Post_UserLikedPosts: {
                    connect: {id: parseInt(postId)}
                }
            }
        })
        res.status(200).json({message: 'Post liked'})
    }
    catch (err) {
        next(err)
    }
})
