import natural from 'natural';
const { TfIdf } = natural;
import Vector from 'vector-object';
import { PrismaClient } from '@prisma/client'
import { fieldEncryptionExtension } from 'prisma-field-encryption'
import { getDistanceCoords } from './post.js';

const client = new PrismaClient()
export const prisma = client.$extends(
    fieldEncryptionExtension()
)

GetRecommendations(1);
export async function GetRecommendations(user_id){
    const posts = await prisma.post.findMany();
    const interactions = await GetUserInteractions(user_id);
    //keyword based recommendation
    const postInformationScores = GetRecommendationsByPostInformation(interactions, posts);
    const informationVector = new Vector(postInformationScores);
    informationVector.normalize().multiply(30);
    //category based recommendation
    const categoryScores = GetRecommendationsByCategory(interactions, posts);
    const categoryVector = new Vector(categoryScores);
    categoryVector.normalize().multiply(10);
    //other users based recommendation
    const user = await prisma.user.findUnique({
        where: {
            id: user_id
        }
    });
    const locationScores = await GetLocationScores(user);
    const locationVector = new Vector(locationScores);
    locationVector.normalize().multiply(10);
    const trendingScores = await GetTrendingScores(posts);
    const trendingVector = new Vector(trendingScores);
    trendingVector.normalize().multiply(25);
    //seller score
    const sellerToScore = {};
    const sellerArr = {};
    for (const p of posts){
        if (!(p.authorId in sellerToScore)){
            sellerToScore[p.authorId] = await GetSellerScore(user_id, p.authorId);
        }
    }
    for (const entry of Object.entries(sellerToScore)){
        for (const post of posts){
            if (entry[0] == post.authorId){
                sellerArr[post.id] = entry[1];
            }
        }
    }
    const sellerVector = new Vector(sellerArr);
    sellerVector.normalize().multiply(25);
    //calculate final score
    const totalVectorObj = informationVector.add(categoryVector).add(trendingVector).add(locationVector).add(sellerVector).toObject();
    const k = 5; // Number of greatest values to find
    let sortedEntries = Object.entries(totalVectorObj).sort(([, valA], [, valB]) => valB - valA);
    // Filter out posts the user has already interacted with
    sortedEntries = sortedEntries.filter(([key]) =>
        !interactions.liked.some(liked => liked.postId === parseInt(key)) &&
        !interactions.saved.some(saved => saved.postId === parseInt(key)) &&
        !interactions.purchased.some(purchased => purchased.id === parseInt(key))
    );
    //Get top k
    return sortedEntries.slice(0, k).map(([key]) => parseInt(key));
}

//HELPER FUNCTIONS
/*
GetUserInteractions
Input: userId
Output:
{
  viewed: [{userId, postId, viewedAt}],
  liked: [],
  saved: [],
  purchased: []
}
*/
async function GetUserInteractions(userId){
    let interactions = {};
    //Get viewed
    const views = await prisma.userViewedPosts.findMany({
        where: {
            userId: userId
        }
    });
    interactions["viewed"] = views;
    //Get liked
    const likes = await prisma.userLikedPosts.findMany({
        where: {
            userId: userId
        }
    });
    interactions["liked"] = likes;
    //Get saved
    const saves = await prisma.userSavedPosts.findMany({
        where: {
            userId: userId
        }
    });
    interactions["saved"] = saves;
    //Get purchased
    const purchases = await prisma.purchase.findMany({
        where: {
            buyerId: userId
        },
        include: {
            post: true
        }
    });
    interactions["purchased"] = purchases.map(purchase => purchase.post);
    return interactions;
}

async function GetAllInteractions(){
    let interactions = {};
    //Get viewed
    const views = await prisma.userViewedPosts.findMany();
    interactions["viewed"] = views;
    //Get liked
    const likes = await prisma.userLikedPosts.findMany();
    interactions["liked"] = likes;
    //Get saved
    const saves = await prisma.userSavedPosts.findMany();
    interactions["saved"] = saves;
    return interactions;
}

//PART 1-- CONTENT BASED RECOMMENDATIONS
/*
GetRecommendationsByPostInformation
Input: userPosts, posts
Output: {postId: score}
*/
//userPosts is an object with multiple arrays of the posts that the user has viewed, liked, saved, purchased
function GetRecommendationsByPostInformation(userPosts, posts){
    //Get Vectors for all posts
    let postVectors = CalculateTFIDF(posts);
    //Calculate user profile vector
    const userProfileVector = CalculateUserProfileVector(userPosts, postVectors);
    //Filter out posts that the user has already liked, saved, purchased
    postVectors = postVectors.filter(post =>
        !(userPosts.liked.some(liked => liked.postId === post.id) ||
        userPosts.saved.some(saved => saved.postId === post.id) ||
        userPosts.purchased.some(purchased => purchased.id === post.id))
    );
    //Calculate cosine similarity
    const result = GetPostsCosineSimilarity(userProfileVector, postVectors);
    return result;
}

function GetPostsCosineSimilarity(currVector, allVectors){
    const cosineSimilarityDict = {};
    //Calculate cosine similarity
    for (let i = 0; i < allVectors.length; i++) {
        const cosineSimilarity = currVector.getCosineSimilarity(allVectors[i].vector);
        //heap only needs to be k size
        cosineSimilarityDict[allVectors[i].id] = cosineSimilarity;
    }
    return cosineSimilarityDict;
}

function FilterString(str) {
    if (!str){
        return "";
    }
    str = str.toLowerCase();
    return str.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
}

function CalculateTFIDF(posts){
    //format data
    let formattedData = []
    for (const post of posts) {
        formattedData.push({
            id: post.id,
            content: FilterString(post.description) + " " + FilterString(post.name),
        });
    }
    //TF-IDF - create vectors for each post
    const postVectors = [];
    let tfidf = new TfIdf();
    for (const post of formattedData) {
        //adds the words inside of post.content to the tfidf body (so word frequency can be calculated)
        tfidf.addDocument(post.content);
    }
    for (let i = 0; i < formattedData.length; i++) {
        //words in each post
        const postContentWords = tfidf.listTerms(i);
        const postContentObj = {};
        for (const word of postContentWords) {
            //tf-idf score for each word
            postContentObj[word.term] = word.tfidf;
        }
        postVectors.push({
            id: formattedData[i].id,
            vector: new Vector(postContentObj),
        });
    }
    return postVectors;
}

function CalculateUserProfileVector(userPosts, postVectors){
    let userProfileObj = {};
    //set weights
    const viewedWeight = 1;
    const likedWeight = 2;
    const savedWeight = 3;
    const purchasedWeight = 4;
    //find each post in postVectors. then add the tf-idf score of each word to the user profile vector
    //consolidate posts
    const allPosts = userPosts.viewed.concat(userPosts.liked, userPosts.saved, userPosts.purchased);
    for (const post of allPosts) {
        for (const postVector of postVectors) {
            if (postVector.id === post.postId || postVector.id === post.id) {
                const postWords = postVector.vector.getComponents();
                let weight = 0;
                if ('viewedAt' in post){
                    weight = viewedWeight;
                }
                else if ('likedAt' in post){
                    weight = likedWeight;
                }
                else if ('savedAt' in post){
                    weight = savedWeight;
                }
                else if ('buyerId' in post){
                    weight = purchasedWeight;
                }
                for (const word of postWords) {
                    userProfileObj[word] = (userProfileObj[word] || 0) + postVector.vector.get(word) * weight;
                }
            }
        }
    }
    return (new Vector(userProfileObj));
}

/*
GetRecommendationsByCategory
*/
function GetRecommendationsByCategory(userPosts, posts){
    //Get post category vectors
    const postCategoryVectors = GetCategoryVectors(posts);

    //Calculate user profile vector
    const userProfileVector = CalculateUserProfileVector(userPosts, postCategoryVectors);

    //Calculate cosine similarity
    const result = GetPostsCosineSimilarity(userProfileVector, postCategoryVectors);

    return result;
}
function GetCategoryVectors(posts){
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
/*
GetLocationScores
*/

async function GetLocationScores(currUser){
    let locationScores = {};
    let users = await prisma.user.findMany();
    const MAX_SCORE = 100;
    users = users.filter(user => getDistanceCoords(user.location, currUser.location) < 100 && user.id !== currUser.id);
    for (const user of users) {
        const distance = getDistanceCoords(user.location, currUser.location);
        const interactions = await GetUserInteractions(user.id);
        const allInteractions = interactions.viewed.concat(interactions.liked, interactions.saved);
        for (const interaction of allInteractions) {
            locationScores[interaction.postId] = (locationScores[interaction.postId] || 0) + MAX_SCORE / (1 + distance);
        }
    }
    return locationScores;
}

/*
GetTrendingScores
*/
async function GetTrendingScores(posts){
    let trendingScores = {};
    for (const post of posts) {
        trendingScores[post.id] = 0;
    }
    //set weights
    const viewedWeight = 1;
    const likedWeight = 2;
    const savedWeight = 3;

    const allInteractions = await GetAllInteractions();
    for (const viewed of allInteractions.viewed) {
        trendingScores[viewed.postId] += CalculateTrendingScore(viewed.viewedAt, viewedWeight);
    }
    for (const liked of allInteractions.liked) {
        trendingScores[liked.postId] += CalculateTrendingScore(liked.likedAt, likedWeight);
    }
    for (const saved of allInteractions.saved) {
        trendingScores[saved.postId] += CalculateTrendingScore(saved.savedAt, savedWeight);
    }
    return trendingScores;
}
function CalculateTrendingScore(interactTime, weight){
    //Calculate score
    const MILLISECONDS_PER_WEEK = 604800000;
    const age = Date.now() - interactTime.getTime();
    const score = weight * Math.exp(-age/MILLISECONDS_PER_WEEK);
    return score;
}

/*
GetSellerScore
*/
async function GetSellerScore(user_id, seller_id){
    let score = 0;
    const ratingWeights = {
        1: -1,
        2: -.5,
        3: .5,
        4: .8,
        5: 1,
        "missing": 1,
    }
    //if the user has purchased from the seller
    //take score into consideration
    const userBought = await prisma.purchase.findMany({
        where: {
            sellerId: seller_id,
            buyerId: user_id
        }
    });
    const MILLISECONDS_PER_WEEK = 604800000;
    for (let i = 0; i < userBought.length; i++){
        const age = Date.now() - userBought[i].purchasedAt.getTime();
        if (userBought[i].rating != null){
            score += Math.exp(-age / MILLISECONDS_PER_WEEK) * ratingWeights[userBought[i].rating];
        }
        else{
            score += Math.exp(-age / MILLISECONDS_PER_WEEK);
        }
    }
    //if seller has recent sold posts from other users, add to score
    const soldPosts = await prisma.purchase.findMany({
        where: {
            sellerId: seller_id,
            NOT: {
                buyerId: user_id,
            }
        }
    });
    for (let i = 0; i < soldPosts.length; i++){
        const age = Date.now() - soldPosts[i].purchasedAt.getTime();
        if (soldPosts[i].rating != null){
            score += Math.exp(-age/ MILLISECONDS_PER_WEEK) * ratingWeights[soldPosts[i].rating];
        }
        else{
            score += Math.exp(-age / MILLISECONDS_PER_WEEK);
        }
    }
    //if seller has a lot of posts
    const posts = await prisma.post.findMany({
        where: {authorId: seller_id}
    })
    //10 posts to increase score by 1
    score += posts.length * .1;
    return score;
}
