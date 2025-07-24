import natural from "natural";
const { TfIdf } = natural;
import Vector from "vector-object";
import { PrismaClient } from "@prisma/client";
import { fieldEncryptionExtension } from "prisma-field-encryption";
import { getDistanceCoords } from "./post.js";

const client = new PrismaClient();
export const prisma = client.$extends(fieldEncryptionExtension());

// Global variables
const VIEWED_WEIGHT = 1;
const LIKED_WEIGHT = 2;
const SAVED_WEIGHT = 3;
const PURCHASED_WEIGHT = 4;
const MILLISECONDS_PER_WEEK = 604800000;
const MAX_LOCATION_SCORE = 100;
const RATING_WEIGHTS = {
  1: -1,
  2: -0.5,
  3: 0.5,
  4: 0.8,
  5: 1,
  missing: 1,
};
const USER_SOLD_WEIGHT = 3;
const WEIGHTS = {
  information: 25,
  category: 25,
  otherUsers: 25,
  seller: 25,
};

// MAIN FUNCTION
export async function getRecommendations(user_id, k) {
  const posts = await prisma.post.findMany();
  const interactions = await getUserInteractions(user_id);
  // keyword based recommendation
  const postInformationScores = getRecommendationsByPostInformation(
    interactions,
    posts
  );
  const informationVector = new Vector(postInformationScores);
  informationVector.normalize().multiply(WEIGHTS.information);
  // category based recommendation
  const categoryScores = getRecommendationsByCategory(interactions, posts);
  const categoryVector = new Vector(categoryScores);
  categoryVector.normalize().multiply(WEIGHTS.category);
  // other users based recommendation
  const user = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
  });
  let locationScores;
  let locationVector = new Vector();
  if (user.location) {
    locationScores = await getLocationScores(user);
    locationVector = new Vector(locationScores);
    locationVector.normalize();
  }
  const trendingScores = await getTrendingScores(posts);
  const trendingVector = new Vector(trendingScores);
  trendingVector.normalize();
  const otherUserScores = trendingVector
    .add(locationVector)
    .multiply(WEIGHTS.otherUsers);
  // seller score
  const sellerToScore = {};
  const sellerArr = {};
  for (const p of posts) {
    if (!(p.authorId in sellerToScore)) {
      sellerToScore[p.authorId] = await getSellerScore(user_id, p.authorId);
    }
  }
  for (const entry of Object.entries(sellerToScore)) {
    for (const post of posts) {
      if (entry[0] == post.authorId) {
        sellerArr[post.id] = entry[1];
      }
    }
  }
  const sellerVector = new Vector(sellerArr);
  sellerVector.normalize().multiply(WEIGHTS.seller);
  // calculate final score
  const totalVectorObj = informationVector
    .clone()
    .add(categoryVector)
    .add(otherUserScores)
    .add(sellerVector)
    .toObject();
  let sortedEntries = Object.entries(totalVectorObj).sort(
    ([, scoreA], [, scoreB]) => scoreB - scoreA
  );
  // Filter out posts the user has already interacted with
  sortedEntries = sortedEntries.filter(
    ([key]) =>
      !interactions.liked.some((liked) => liked.postId === parseInt(key)) &&
      !interactions.saved.some((saved) => saved.postId === parseInt(key)) &&
      !interactions.purchased.some(
        (purchased) => purchased.id === parseInt(key)
      )
  );
  // get the highest score for each post
  const allVectors = {
    0: informationVector.toObject(),
    1: categoryVector.toObject(),
    2: otherUserScores.toObject(),
    3: sellerVector.toObject(),
  };
  const postIds = sortedEntries.map(([postId, _]) => postId.toString());
  const postsToHighest = getMaxCategoryPerPost(postIds, allVectors);

  // Get top k
  sortedEntries = sortedEntries
    .slice(0, k)
    .map(([key, value]) => [parseInt(key), value, postsToHighest[key][0]]);
  return sortedEntries;
}

// HELPER FUNCTIONS
function getMaxCategoryPerPost(postIds, allVectors) {
  const postsToHighest = {};
  for (const postId of postIds) {
    postsToHighest[postId] = [-1, -Infinity];
    for (const [type, vectorValues] of Object.entries(allVectors)) {
      const score =
        vectorValues[postId] != undefined ? vectorValues[postId] : -Infinity;
      if (score > postsToHighest[postId][1]) {
        postsToHighest[postId][0] = type;
        postsToHighest[postId][1] = score;
      }
    }
  }
  return postsToHighest;
}

/**
 * Get user interactions
 * @param {Number} userId
 * @returns {Object}
 */
async function getUserInteractions(userId) {
  let interactions = {};
  // Get viewed
  const views = await prisma.userViewedPosts.findMany({
    where: {
      userId: userId,
    },
  });
  interactions["viewed"] = views;
  // Get liked
  const likes = await prisma.userLikedPosts.findMany({
    where: {
      userId: userId,
    },
  });
  interactions["liked"] = likes;
  // Get saved
  const saves = await prisma.userSavedPosts.findMany({
    where: {
      userId: userId,
    },
  });
  interactions["saved"] = saves;
  // Get purchased
  const purchases = await prisma.purchase.findMany({
    where: {
      buyerId: userId,
    },
    include: {
      post: true,
    },
  });
  interactions["purchased"] = purchases.map((purchase) => purchase.post);
  return interactions;
}

async function getAllInteractions() {
  let interactions = {};
  // Get viewed
  const views = await prisma.userViewedPosts.findMany();
  interactions["viewed"] = views;
  // Get liked
  const likes = await prisma.userLikedPosts.findMany();
  interactions["liked"] = likes;
  // Get saved
  const saves = await prisma.userSavedPosts.findMany();
  interactions["saved"] = saves;
  return interactions;
}

// PART 1-- CONTENT BASED RECOMMENDATIONS
/**
 * Get recommendations by post information
 * @param {Object} userPosts
 * @param {Post[]} posts
 * @returns
 */
// userPosts is an object with multiple arrays of the posts that the user has viewed, liked, saved, purchased
function getRecommendationsByPostInformation(userPosts, posts) {
  // Get Vectors for all posts
  let postVectors = calculateTFIDF(posts);
  // Calculate user profile vector
  const userProfileVector = calculateUserProfileVector(userPosts, postVectors);
  // Filter out posts that the user has already liked, saved, purchased
  postVectors = postVectors.filter(
    (post) =>
      !(
        userPosts.liked.some((liked) => liked.postId === post.id) ||
        userPosts.saved.some((saved) => saved.postId === post.id) ||
        userPosts.purchased.some((purchased) => purchased.id === post.id)
      )
  );
  // Calculate cosine similarity
  const result = getPostsCosineSimilarity(userProfileVector, postVectors);
  return result;
}

function getPostsCosineSimilarity(currVector, allVectors) {
  const cosineSimilarityDict = {};
  // Calculate cosine similarity
  for (let i = 0; i < allVectors.length; i++) {
    const cosineSimilarity = currVector.getCosineSimilarity(
      allVectors[i].vector
    );
    // heap only needs to be k size
    cosineSimilarityDict[allVectors[i].id] = cosineSimilarity;
  }
  return cosineSimilarityDict;
}

function filterString(str) {
  if (!str) {
    return "";
  }
  str = str.toLowerCase();
  return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

function calculateTFIDF(posts) {
  // format data
  let formattedData = [];
  for (const post of posts) {
    formattedData.push({
      id: post.id,
      content: filterString(post.description) + " " + filterString(post.name),
    });
  }
  // TF-IDF - create vectors for each post
  const postVectors = [];
  let tfidf = new TfIdf();
  for (const post of formattedData) {
    // adds the words inside of post.content to the tfidf body (so word frequency can be calculated)
    tfidf.addDocument(post.content);
  }
  for (let i = 0; i < formattedData.length; i++) {
    // words in each post
    const postContentWords = tfidf.listTerms(i);
    const postContentObj = {};
    for (const word of postContentWords) {
      // tf-idf score for each word
      postContentObj[word.term] = word.tfidf;
    }
    postVectors.push({
      id: formattedData[i].id,
      vector: new Vector(postContentObj),
    });
  }
  return postVectors;
}

function calculateUserProfileVector(userPosts, postVectors) {
  let userProfileObj = {};
  // find each post in postVectors. then add the tf-idf score of each word to the user profile vector
  // consolidate posts
  const allPosts = userPosts.viewed.concat(
    userPosts.liked,
    userPosts.saved,
    userPosts.purchased
  );
  for (const post of allPosts) {
    for (const postVector of postVectors) {
      if (postVector.id === post.postId || postVector.id === post.id) {
        const postWords = postVector.vector.getComponents();
        let weight = getWeight(post);
        for (const word of postWords) {
          userProfileObj[word] =
            (userProfileObj[word] || 0) + postVector.vector.get(word) * weight;
        }
      }
    }
  }
  return new Vector(userProfileObj);
}

function getWeight(interaction) {
  if ("viewedAt" in interaction) {
    return VIEWED_WEIGHT;
  } else if ("likedAt" in interaction) {
    return LIKED_WEIGHT;
  } else if ("savedAt" in interaction) {
    return SAVED_WEIGHT;
  } else {
    return PURCHASED_WEIGHT;
  }
}

function getRecommendationsByCategory(userPosts, posts) {
  // Get post category vectors
  const postCategoryVectors = getCategoryVectors(posts);

  // Calculate user profile vector
  const userProfileVector = calculateUserProfileVector(
    userPosts,
    postCategoryVectors
  );

  // Calculate cosine similarity
  const result = getPostsCosineSimilarity(
    userProfileVector,
    postCategoryVectors
  );

  return result;
}

function getCategoryVectors(posts) {
  let postVectors = [];
  for (const post of posts) {
    const postCategoryObj = {};
    postCategoryObj[post.category] = 1;
    postVectors.push({
      id: post.id,
      vector: new Vector(postCategoryObj),
    });
  }
  return postVectors;
}

//PART 2-- COLLABORATIVE FILTERING RECOMMENDATIONS
async function getLocationScores(currUser) {
  let locationScores = {};
  let users = await prisma.user.findMany();
  users = users.filter(
    (user) =>
      user.location &&
      getDistanceCoords(user.location, currUser.location) < 100 &&
      user.id !== currUser.id
  );
  for (const user of users) {
    const distance = getDistanceCoords(user.location, currUser.location);
    const interactions = await getUserInteractions(user.id);
    const allInteractions = interactions.viewed.concat(
      interactions.liked,
      interactions.saved
    );
    for (const interaction of allInteractions) {
      locationScores[interaction.postId] =
        (locationScores[interaction.postId] || 0) +
        MAX_LOCATION_SCORE / (1 + distance);
    }
  }
  return locationScores;
}

export async function getTrendingScores(posts) {
  let trendingScores = {};
  for (const post of posts) {
    trendingScores[post.id] = 0;
  }
  const allInteractions = await getAllInteractions();
  for (const viewed of allInteractions.viewed) {
    trendingScores[viewed.postId] += calculateTrendingScore(
      viewed.viewedAt,
      VIEWED_WEIGHT
    );
  }
  for (const liked of allInteractions.liked) {
    trendingScores[liked.postId] += calculateTrendingScore(
      liked.likedAt,
      LIKED_WEIGHT
    );
  }
  for (const saved of allInteractions.saved) {
    trendingScores[saved.postId] += calculateTrendingScore(
      saved.savedAt,
      SAVED_WEIGHT
    );
  }
  return trendingScores;
}

function calculateTrendingScore(interactTime, weight) {
  const age = Date.now() - interactTime.getTime();
  const score = weight * Math.exp(-age / MILLISECONDS_PER_WEEK);
  return score;
}

async function getSellerScore(user_id, seller_id) {
  let score = 0;

  // if seller has recent sold posts from user/other users, add to score
  // more weight if user has sold to seller
  const soldPosts = await prisma.purchase.findMany({
    where: {
      sellerId: seller_id,
    },
  });
  for (let i = 0; i < soldPosts.length; i++) {
    let weight = soldPosts[i].buyerId == user_id ? USER_SOLD_WEIGHT : 1;
    const age = Date.now() - soldPosts[i].purchasedAt.getTime();
    const post_weight =
      soldPosts[i].rating != null
        ? RATING_WEIGHTS[soldPosts[i].rating] * weight
        : weight;
    score += Math.exp(-age / MILLISECONDS_PER_WEEK) * post_weight;
  }
  // if seller has a lot of posts
  const posts = await prisma.post.findMany({
    where: { authorId: seller_id },
  });
  // 10 posts to increase score by 1
  score += posts.length * 0.1;
  return score;
}
