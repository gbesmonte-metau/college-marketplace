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

//Content based recommendation----------
//Names + descriptions
export function GetRecommendations(post_id, posts, k){
    //Get Vectors for all posts
    const postVectors = CalculateTFIDF(posts);

    //Find the post with post id
    let currPost;
    for (let i = 0; i < postVectors.length; i++) {
        if (postVectors[i].id == post_id){
            currPost = postVectors[i];
        }
    }
    if (currPost == null){
        return;
    }

    //Calculate cosine similarity
    //Maintain an ordered max heap
    const csmCmp = (a, b) => b.csim - a.csim;
    const csimHeap = new Heap(csmCmp);
    csimHeap.init([]);
    for (let i = 0; i < postVectors.length; i++) {
        if (postVectors[i].id != post_id){
            const csim = currPost.vector.getCosineSimilarity(postVectors[i].vector);
            csimHeap.push({ id: postVectors[i].id, csim });
        }
    }
    //Get top k recommendations
    const topK = [];
    for (let i = 0; i < k; i++) {
        if (csimHeap.size() > 0) {
            topK.push(csimHeap.pop());
        }
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

console.log(GetRecommendations(1, tempPosts, 3));
