import express from 'express';
import { PrismaClient } from '@prisma/client'
import { fieldEncryptionExtension } from 'prisma-field-encryption'
import { GetTrendingScores } from './recommended.js';

const client = new PrismaClient()
export const prisma = client.$extends(
    fieldEncryptionExtension()
)

export const router = express.Router();
router.use(express.json())

//Auth check middleware
function isAuthenticated (req, res, next) {
    if (req.session.user) next()
    else {
        res.status(401).json({ message: 'User not authenticated' })
    }
}

//Distance filtering calculations
/* creds: https://gist.github.com/SimonJThompson/c9d01f0feeb95b18c7b0 */
function toRad(v){return v * Math.PI / 180;}
function kmToMiles(km) {return (km * 0.62137).toFixed(2);}
function haversine(l1, l2) {
	var R = 6371; // km
	var x1 = l2.lat-l1.lat;
	var dLat = toRad(x1);
	var x2 = l2.lng-l1.lng;
	var dLon = toRad(x2);
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			Math.cos(toRad(l1.lat)) * Math.cos(toRad(l2.lat)) *
			Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d;
}
export function getDistanceCoords(coord1, coord2){
    const distanceKM = haversine(coord1, coord2);
    return kmToMiles(distanceKM);
}


//Get post of id
router.get('/posts/:id', async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            },
            include: {
                purchase: true
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
        if (req.query?.price) {
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
        //multiple colors
        if (Array.isArray(req.query.color)) {
            const colors = req.query.color.map(String);
            whereClause.color = { in: colors, mode: 'insensitive' };
        }
        //one color
        else if (req.query?.color){
            whereClause.color = { contains: req.query.color, mode: 'insensitive' };
        }
        //multiple conditions
        if (Array.isArray(req.query.condition)) {
            const conditions = req.query.condition.map(String);
            whereClause.condition = { in: conditions, mode: 'insensitive' };
        }
        //one condition
        else if (req.query?.condition){
            whereClause.condition = { contains: req.query.condition, mode: 'insensitive' };
        }
        //search
        if (req.query.search) {
            whereClause.OR = [
                { name: { contains: req.query.search, mode: 'insensitive' } },
                { description: { contains: req.query.search, mode: 'insensitive'} },
            ]
        }
        //filter out sold items
        whereClause.purchase = null;
        let posts = await prisma.post.findMany({
            where: whereClause,
            include: {
                purchase: true
            }
        })
        //distance
        if (posts && req.query.distance && req.query.distance != 'undefined' && req.session.user && req.session.user.location) {
            const distance = parseInt(req.query.distance);
            const userLocation = JSON.parse(req.session.user.location);
            posts = posts.filter(post => {
                const postLocation = JSON.parse(post.location);
                const actualDistance = getDistanceCoords(userLocation, postLocation);
                return actualDistance <= distance;
            })
        }
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

//Get all users that liked post
router.get('/posts/:id/likes', async (req, res, next) => {
    const postId = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            },
            include: {
                UserLikedPosts: true
            }
        })
        const usersLiked = post.UserLikedPosts;
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

//Create a new post
router.post('/posts', async (req, res, next) => {
    const newPost = req.body;
    try {
        //check if post has all required fields
        const isNewPostValid = (
          newPost.price !== null &&
          newPost.category !== null &&
          newPost.name !== null &&
          newPost.time_created !== null &&
          newPost.location !== null &&
          newPost.authorId !== null &&
          newPost.location !== null
        )
        //create post
        if (isNewPostValid) {
          const created = await prisma.post.create({data:newPost})
          res.status(201).json(created)
        } else {
          next({ status: 422, message: 'New post is not valid- missing a field' })
        }
    } catch (err) {
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

//Purchase a post
router.post('/posts/:id/purchase', isAuthenticated, async (req, res, next) => {
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
        if (getPost.authorId === userId) {
            next({ status: 403, message: `You are the author of this post` });
            return;
        }
        const newPost = await prisma.purchase.create({
            data: {
                buyerId: userId,
                sellerId: getPost.authorId,
                postId: parseInt(postId),
            }
        });
        if (newPost) {
            res.status(200).json(newPost)
        }
        else {
            next({ status: 404, message: `No post found with ID ${postId}` })
        }
    }
    catch (err) {
        next(err)
    }
})

//Get all posts a user bought
router.get('/bought', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    try {
        const posts = await prisma.purchase.findMany({
            where: {
                buyerId: parseInt(userId)
            },
            include: {
                post: true
            }
        })
        if (posts.length > 0) {
            const allPosts = posts.map(post => post.post);
            res.status(200).json(allPosts)
        } else {
            next({ status: 404, message: `No posts found with user ID ${userId}` })
        }
    }
    catch (err) {
        next(err)
    }
})

//Get all posts a user sold
router.get('/sold', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id;
    try {
        const posts = await prisma.purchase.findMany({
            where: {
                sellerId: parseInt(userId)
            },
            include: {
                post: true
            }
        })
        if (posts.length > 0) {
            const allPosts = posts.map(post => post.post);
            res.status(200).json(allPosts)
        } else {
            next({ status: 404, message: `No posts found with user ID ${userId}` })
        }
    }
    catch (err) {
        next(err)
    }
})


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
                id: parseInt(postId)
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

//Update a rating
router.patch('/purchases/:id/rating', isAuthenticated, async (req, res, next) => {
    const userId = req.session.user.id
    const post = req.params.id;

    const updatedFields = req.body;
    try {
        const getPost = await prisma.purchase.findUnique({
            where: {
                postId: parseInt(post)
            }
        });
        if (!getPost) {
            next({ status: 404, message: `No post found with ID ${post}` });
        }
        if (getPost.buyerId !== userId) {
            next({ status: 403, message: `You are not the buyer of this post` });
        }
        const newPost = await prisma.purchase.update({
            where: {
                postId: parseInt(post)
            },
            data: updatedFields
        });
        if (newPost) {
            res.status(200).json(newPost)
        } else {
            next({ status: 404, message: `No post found with ID ${post}` })
        }
    } catch (err) {
        next(err)
    }
});

//get trending posts
router.get('/trending', async (req, res, next) => {
    try{
        const posts = await prisma.post.findMany();
        const trendingScores = await GetTrendingScores(posts);
        let sorted = Object.entries(trendingScores).sort(([, valA], [, valB]) => valB - valA);
        const postIdArr = sorted.map(([key, ]) => parseInt(key));
        let trendingPosts = [];
        for (const postId of postIdArr) {
            const post = await prisma.post.findUnique({
                where: {
                    id: postId
                }
            })
            if (post){
                trendingPosts.push(post);
            }
        }
        trendingPosts = trendingPosts.slice(0, 10);
        if (trendingPosts.length > 0) {
            res.status(200).json(trendingPosts)
        } else {
            next({ status: 404, message: 'No trending posts found' })
        }
    }
    catch (err) {
        next(err)
    }
});
