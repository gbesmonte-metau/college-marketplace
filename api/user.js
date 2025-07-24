import express from "express";
import { PrismaClient } from "@prisma/client";
import { hashPassword, verifyPassword } from "./bcrypt.js";
import { fieldEncryptionExtension } from "prisma-field-encryption";
import { getRecommendations } from "./recommended.js";
import { calculateBundles } from "./bundles.js";

const client = new PrismaClient();
export const prisma = client.$extends(fieldEncryptionExtension());

export const router = express.Router();
router.use(express.json());

//Auth check middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) next();
  else {
    res.status(401).json({ message: "User not authenticated" });
  }
}
//USER ENDPOINTS
//Get the user information of the currently authenticated user
router.get("/user", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      next({ status: 404, message: `No user found with ID ${userId}` });
    }
  } catch (err) {
    next(err);
  }
});

//Register a new user
router.post("/users/register", async (req, res, next) => {
  const newUser = req.body;
  try {
    //check if user has all required fields
    const isNewUserValid =
      newUser.email !== undefined &&
      newUser.password !== undefined &&
      newUser.username !== undefined;
    if (!isNewUserValid) {
      next({ status: 422, message: "New user is not valid" });
    }
    //check if username or email is taken
    const userExists = await prisma.user.findMany({
      where: {
        OR: [{ email: newUser.email }, { username: newUser.username }],
      },
    });
    if (userExists.length > 0) {
      if (userExists[0].email === newUser.email) {
        next({ status: 409, message: "Email already exists" });
        return;
      }
      if (userExists[0].username === newUser.username) {
        next({ status: 409, message: "Username already exists" });
        return;
      }
      next({ status: 409, message: "Email or username already exists" });
      return;
    }
    //hash password
    const hash = await hashPassword(newUser.password);
    //create user
    const created = await prisma.user.create({
      data: { ...newUser, password: hash },
    });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

//Login user
router.post("/users/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const isValid = await verifyPassword(password, user.password);
    if (isValid) {
      req.session.user = user;
      res.status(200).json(user);
    } else {
      next({ status: 401, message: "Invalid credentials" });
      return;
    }
  } else {
    next({ status: 401, message: "Email not found" });
    return;
  }
});

//Logout user
router.post("/user/logout", isAuthenticated, (req, res, next) => {
  req.session.user = null;
  res.json({ message: "Logout successful" });
});

//Get user information by ID
router.get("/users/:id", async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(userId),
      },
    });
    if (user) {
      res.status(200).json(user);
    } else {
      next({ status: 404, message: `No user found with ID ${userId}` });
    }
  } catch (err) {
    next(err);
  }
});

//Edit user profile
router.patch("/user", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const updatedFields = req.body;
  try {
    const newUser = await prisma.user.update({
      where: {
        id: parseInt(userId),
      },
      data: updatedFields,
    });
    if (newUser) {
      req.session.user = newUser;
      res.status(200).json(newUser);
    } else {
      next({ status: 404, message: `No user found with ID ${userId}` });
    }
  } catch (err) {
    next(err);
  }
});

//Get all posts that user liked
router.get("/user/likes", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  try {
    const likedPostsData = await prisma.userLikedPosts.findMany({
      where: {
        userId: userId,
      },
      include: {
        post: {
          include: {
            _count: {
              select: {
                usersLiked: true,
                usersSaved: true,
              },
            },
          },
        },
      },
    });
    if (likedPostsData) {
      const likedPosts = likedPostsData.map((data) => data.post);
      res.status(200).json(likedPosts);
    } else {
      next({ status: 404, message: `No liked posts` });
    }
  } catch (err) {
    next(err);
  }
});

//Get if user liked a post
router.get("/user/like/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const postId = req.params.id;
  try {
    const post = await prisma.userLikedPosts.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: parseInt(postId),
        },
      },
    });
    res.status(200).json({ liked: post });
  } catch (err) {
    next(err);
  }
});

//Like a post
router.post("/user/like/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const postId = req.params.id;
  try {
    await prisma.userLikedPosts.create({
      data: {
        userId: userId,
        postId: parseInt(postId),
      },
    });
    res.status(200).json({ message: "Post liked" });
  } catch (err) {
    next(err);
  }
});

//Unlike a post
router.post("/user/unlike/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const postId = req.params.id;
  try {
    await prisma.userLikedPosts.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: parseInt(postId),
        },
      },
    });
    res.status(200).json({ message: "Post unliked" });
  } catch (err) {
    next(err);
  }
});

//Get if user saved a post
router.get("/user/save/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const postId = req.params.id;
  try {
    const post = await prisma.userSavedPosts.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: parseInt(postId),
        },
      },
    });
    res.status(200).json({ saved: post });
  } catch (err) {
    next(err);
  }
});

//Get all posts that user saved
router.get("/user/saves", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  try {
    const savedPostsData = await prisma.userSavedPosts.findMany({
      where: {
        userId: userId,
      },
      include: {
        post: {
          include: {
            _count: {
              select: {
                usersLiked: true,
                usersSaved: true,
              },
            },
          },
        },
      },
    });
    if (savedPostsData) {
      const savedPosts = savedPostsData.map((data) => data.post);
      res.status(200).json(savedPosts);
    } else {
      next({ status: 404, message: `No saved posts` });
    }
  } catch (err) {
    next(err);
  }
});

//Save a post
router.post("/user/save/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const postId = req.params.id;
  try {
    await prisma.userSavedPosts.create({
      data: {
        userId: userId,
        postId: parseInt(postId),
      },
    });
    res.status(200).json({ message: "Post saved" });
  } catch (err) {
    next(err);
  }
});

//Unsave a post
router.post("/user/unsave/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const postId = req.params.id;
  try {
    await prisma.userSavedPosts.delete({
      where: {
        userId_postId: {
          userId: userId,
          postId: parseInt(postId),
        },
      },
    });
    res.status(200).json({ message: "Post unsaved" });
  } catch (err) {
    next(err);
  }
});

//View a post
router.post("/user/view/:id", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const postId = req.params.id;
  try {
    const post = await prisma.userViewedPosts.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: parseInt(postId),
        },
      },
    });
    if (post) {
      //TODO: update time viewed
      res.status(200).json({ message: "Post viewed" });
    } else {
      await prisma.userViewedPosts.create({
        data: {
          userId: userId,
          postId: parseInt(postId),
        },
      });
      res.status(200).json({ message: "Post viewed" });
    }
  } catch (err) {
    next(err);
  }
});

//Get recommendations for current user
router.get("/user/recommendations", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const recommendedPosts = [];
  const postArr = await getRecommendations(userId);
  for (const p of postArr) {
    const post = await prisma.post.findUnique({
      where: {
        id: p[0],
      },
      include: {
        _count: {
          select: {
            usersLiked: true,
            usersSaved: true,
          },
        },
      },
    });
    post["best_category"] = p[2];
    recommendedPosts.push(post);
  }
  res.status(200).json(recommendedPosts);
});

//POST - Get bundles for current user
router.post("/user/bundles", isAuthenticated, async (req, res, next) => {
  const userId = req.session.user.id;
  const body = req.body;
  const queries = body.queries;
  const priorities = body.priorities;
  const budget = body.budget;
  try {
    const posts = await prisma.post.findMany({
      where: {
        time_sold: null,
        NOT: {
          authorId: userId,
        },
      },
      include: {
        _count: {
          select: {
            usersLiked: true,
            usersSaved: true,
          },
        },
      },
    });
    if (!posts) {
      next({ status: 200, message: "No posts found" });
      return;
    }
    if (!queries || !priorities || !budget) {
      next({ status: 422, message: "Invalid body" });
      return;
    }
    const bundles = await calculateBundles(
      posts,
      queries,
      budget,
      userId,
      priorities,
    );
    res.status(200).json(bundles);
  } catch (err) {
    next(err);
  }
});
