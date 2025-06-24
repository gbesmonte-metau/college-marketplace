import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '../generated/prisma/index.js'
import { hashPassword, verifyPassword } from './bcrypt.js';

const prisma = new PrismaClient()
export const router = express.Router();
router.use(express.json())

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
        if (isNewUserValid) {
            const created = await prisma.user.create({
                data: {...newUser, password: hash}
            })
            res.status(201).json(created)
        } else {
          next({ status: 422, message: 'New user is not valid' })
        }
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
