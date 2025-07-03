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


//Register a new user
router.post('/users/register', async (req, res, next) => {
    const newUser = req.body;
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
router.post('/users/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({where: {email}});
    if (user) {
        const isValid = await verifyPassword(password, user.password);
        if (isValid) {
            req.session.user = user;
            res.status(200).json(user);
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

//Get user information by ID
router.get('/users/:id', async (req, res, next) => {
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

//Get all posts that user liked
router.get('/user/likes', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
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
        if (likedPosts){
            res.status(200).json(likedPosts);
        }
        else{
            next({ status: 404, message: `No liked posts` })
        }
    }
    catch (err) {
        next(err)
    }
})


//Get if user liked a post
router.get('/user/like/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    const postId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {id : userId},
            include: {
                Post_UserLikedPosts: true,
            }
        })
        if (!user){
            next({ status: 404, message: `No user found with ID ${userId}` })
        }
        const post = user.Post_UserLikedPosts.find(post => post.id === parseInt(postId));
        res.status(200).json({liked: post});
    }
    catch (err) {
        next(err)
    }
})

//Like a post
router.post('/user/like/:id', isAuthenticated, async (req, res, next) => {
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

//Unlike a post
router.post('/user/unlike/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    const postId = req.params.id;
    try {
        await prisma.user.update({
            where: {id: userId},
            data: {
                Post_UserLikedPosts: {
                    disconnect: {id: parseInt(postId)}
                }
            }
        });
        res.status(200).json({message: 'Post unliked'});
    }
    catch (err) {
        next(err)
    }
});

//Get if user saved a post
router.get('/user/save/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    const postId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: {id : userId},
            include: {
                Post_UserSavedPosts: true,
            }
        })
        if (!user){
            next({ status: 404, message: `No user found with ID ${userId}` })
        }
        const post = user.Post_UserSavedPosts.find(post => post.id === parseInt(postId));
        res.status(200).json({saved: post});
    }
    catch (err) {
        next(err)
    }
})


//Get all posts that user saved
router.get('/user/saves', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(userId)
            },
            include: {
                Post_UserSavedPosts: true
            }
        })
        const savedPosts = user.Post_UserSavedPosts;
        if (savedPosts){
            res.status(200).json(savedPosts);
        }
        else{
            next({ status: 404, message: `No saved posts` })
        }
    }
    catch (err) {
        next(err)
    }
})

//Save a post
router.post('/user/save/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    const postId = req.params.id;
    try {
        await prisma.user.update({
            where: {id: userId},
            data: {
                Post_UserSavedPosts: {
                    connect: {id: parseInt(postId)}
                }
            }
        })
        res.status(200).json({message: 'Post saved'})
    }
    catch (err) {
        next(err)
    }
})

//Unsave a post
router.post('/user/unsave/:id', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    const postId = req.params.id;
    try {
        await prisma.user.update({
            where: {id: userId},
            data: {
                Post_UserSavedPosts: {
                    disconnect: {id: parseInt(postId)}
                }
            }
        });
        res.status(200).json({message: 'Post unsaved'});
    }
    catch (err) {
        next(err)
    }
});
