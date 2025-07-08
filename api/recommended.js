import natural from 'natural';
const { TfIdf } = natural;
import Vector from 'vector-object';
import {Heap} from 'heap-js';

const tempPosts = [
    {
      "id": 1,
      "price": 129.99,
      "category": 0,
      "name": "Regular Razor Scooter",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.8044, \"lng\": -122.2711}",    // Oakland (~8 miles)
      "description": "A sleek, modern scooter with smart features and voice control.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565221/microwave_rwntzs.jpg",
      "condition": "New",
      "brand": "Razor",
      "color": "Silver",
      "authorId": 1
    },
    {
      "id": 2,
      "price": 299.99,
      "category": 1,
      "name": "Electric Scooter X200",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.6879, \"lng\": -122.4702}",    // Daly City (~10 miles)
      "description": "High-speed electric scooter with a 25-mile range.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565212/electric_scooter_r8gzzy.jpg",
      "condition": "Like New",
      "brand": "EcoRide",
      "color": "Red",
      "authorId": 2
    },
    {
      "id": 3,
      "price": 49.99,
      "category": 2,
      "name": "Non-Stick Frying Pan",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.4419, \"lng\": -122.1430}",    // Palo Alto (~33 miles)
      "description": "Durable non-stick frying pan for everyday cooking.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565317/pan-554072_1280_pxwc0z.jpg",
      "condition": "Good",
      "brand": "CookMaster",
      "color": "Black",
      "authorId": 3
    },
    {
      "id": 4,
      "price": 199.99,
      "category": 3,
      "name": "Memory Foam Mattress Topper",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 38.1041, \"lng\": -122.2566}",    // Santa Rosa (~56 miles, a bit further but close enough)
      "description": "Enhance your sleep with this comfortable memory foam topper.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565361/comfort-8069094_1280_bh7jod.jpg",
      "condition": "Fair",
      "brand": "SleepWell",
      "color": "Blue",
      "authorId": 4
    },
    {
      "id": 5,
      "price": 15.99,
      "category": 4,
      "name": "Djungelskog Plush Bear",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.3382, \"lng\": -121.8863}",    // San Jose (~48 miles)
      "description": "Soft and cuddly plush bear from the Djungelskog collection.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565480/giant-teddy-4353077_1280_rg0xww.jpg",
      "condition": "Unspecified",
      "brand": "IKEA",
      "color": "Brown",
      "authorId": 5
    },
]

const exampleUserPosts =
[
    {id: 1, interact: "viewed"}
]


//Content based recommendation----------

//Get k most similar posts to a given post post_id
export function GetRecommendationsForPost(post_id, posts, k){
    //Get Vectors for all posts
    const postVectors = CalculateTFIDF(posts);

    //Find the post with post id
    let currPost;
    for (let i = 0; i < postVectors.length; i++) {
        if (postVectors[i].id == post_id){
            currPost = postVectors[i];
            //filter out the current post from the list of posts
            postVectors.splice(i, 1);
        }
    }
    if (currPost == null){
        return;
    }

    //Calculate cosine similarity
    const topK = GetKCosineSimilarity(currPost.vector, postVectors, k);
    return topK;
}

//Get k most similar posts to a given user user_id
//userPosts is an object with multiple arrays of the posts that the user has viewed, liked, saved, purchased
export function GetRecommendationsForUser(userPosts, posts, k){
    //Get Vectors for all posts
    const postVectors = CalculateTFIDF(posts);

    //Calculate user profile vector
    const userProfileVector = CalculateUserProfileVector(userPosts, postVectors);

    //Filter out posts that the user has already viewed, liked, saved, purchased
    for (const userPost of userPosts) {
        for (let i = 0; i < postVectors.length; i++) {
            if (postVectors[i].id === userPost.id) {
                postVectors.splice(i, 1);
            }
        }
    }

    //Calculate cosine similarity
    const topK = GetKCosineSimilarity(userProfileVector, postVectors, k);
    return topK;
}

function GetKCosineSimilarity(currVector, allVectors, k){
    //Calculate cosine similarity
    //Maintain an ordered min heap
    const csmCmp = (a, b) => a.csim - b.csim;
    const csimHeap = new Heap(csmCmp);
    csimHeap.init([]);
    for (let i = 0; i < allVectors.length; i++) {
        const csim = currVector.getCosineSimilarity(allVectors[i].vector);
        //heap only needs to be k size
        csimHeap.push({ id: allVectors[i].id, csim });
        if (csimHeap.size() > k) {
            csimHeap.pop();
        }
    }
    //Get top k recommendations
    const topK = [];
    while (csimHeap.size() > 0) {
        topK.push(csimHeap.pop());
    }
    return topK;
}

function FilterString(str) {
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
    //find each post in postVectors. then add the tf-idf score of each word to the user profile vector
    //Viewed posts
    for (const userPost of userPosts) {
        for (const post of postVectors) {
            if (post.id === userPost.id) {
                const postWords = post.vector.getComponents();
                for (const word of postWords) {
                    switch (userPost.interact) {
                        case "viewed":
                            userProfileObj[word] = (userProfileObj[word] || 0) + post.vector.get(word);
                            break;
                        case "liked":
                            userProfileObj[word] = (userProfileObj[word] || 0) + post.vector.get(word) * 2;
                            break;
                        case "saved":
                            userProfileObj[word] = (userProfileObj[word] || 0) + post.vector.get(word) * 3;
                            break;
                        case "purchased":
                            userProfileObj[word] = (userProfileObj[word] || 0) + post.vector.get(word) * 4;
                            break;
                    }
                }
            }
        }
    }
    return (new Vector(userProfileObj));
}


console.log(GetRecommendationsForPost(1, tempPosts, 10));
console.log(GetRecommendationsForUser(exampleUserPosts, tempPosts, 10));
