import fuzzy from 'fuzzy';
import { GetRecommendations } from './recommended.js';

//Test Data
const tempItems =
[
    {
      "id": 1,
      "name": "Modern Desk Lamp",
      "recommend_score": 0.4,
      "price": 49.99
    },
    {
      "id": 2,
      "name": "LED Table Lamp",
      "recommend_score": 0.9,
      "price": 52.00
    },
    {
      "id": 3,
      "name": "Minimalist Floor Lamp",
      "recommend_score": 0.1,
      "price": 30.75
    },
    {
      "id": 4,
      "name": "Classic Wood Bedframe",
      "recommend_score": 0.3,
      "price": 229.00
    },
    {
      "id": 5,
      "name": "Oak Frame Bed",
      "recommend_score": 0.6,
      "price": 270.25
    },
    {
      "id": 6,
      "name": "Compact Metal Bed Frame",
      "recommend_score": 0.9,
      "price": 300.80
    },
    {
      "id": 7,
      "name": "Three-Seater Couch",
      "recommend_score": 0.8,
      "price": 580.50
    },
    {
      "id": 8,
      "name": "Deluxe Fabric Couch",
      "recommend_score": 0.9,
      "price": 550.00
    },
    {
      "id": 9,
      "name": "Modern Living Room Couch",
      "recommend_score": 0.5,
      "price": 505.00
    }
]

export async function CalculateBundles(posts, itemQueries, budget, user_id){
    let results = {};
    // find all items that match each query
    for (let i = 0; i < itemQueries.length; i++) {
        const similarItems = FindSimilarItems(itemQueries[i], posts);
        // if no items found for a query, return null
        if (similarItems.length == 0){
            return null;
        }
        results[itemQueries[i]] = similarItems;
    }

    // get cheapest bundle
    let cheapestBundle = GetCheapestBundle(results, budget);

    //get most recommended bundle
    const recommendations = await GetRecommendations(user_id, posts.length);
    posts.forEach(post => {
        recommendations.forEach(recommendation => {
            (post.id == recommendation[0] && recommendation[1]) ? post.recommend_score = recommendation[1] : post.recommend_score = 0;
        });
    });
    let recommendedBundle = GetMostRecommendedBundle(results, budget);

    return {cheapestBundle, recommendedBundle}
}

function GetCheapestBundle(results, budget){
    // get cheapest bundle
    let bundle = [];
    let total = 0;
    const priceCompare = (itemA, itemB) => itemA.price - itemB.price;
    Object.entries(results).forEach(([query, matches]) => {
       // create object list
       let items = [];
       // matches are guaranteed to be non-empty
       for (let i = 0; i < matches.length; i++) {
           items.push(matches[i].original);
       }
       // sort by price
       items.sort(priceCompare);

       // add to bundle
       bundle.push(items[0]);
       total += items[0].price;
    });
    return total > budget ? null : bundle;
}

function GetMostRecommendedBundle(results, budget){
    const allBundles = [];
    CreateAllBundles(results, budget, [], 0, 0, allBundles);

    if (allBundles.length == 0){
        return null;
    }

    // sort by rec score
    allBundles.sort((a, b) => b[1] - a[1]);

    return allBundles[0];
}

/**
 * Recursively creates all possible bundles
 * @param {Object} results
 * @param {Number} budget
 * @param {Object[]} currBundle
 * @param {Number} currTotal
 * @param {Number} currRec
 * @param {Array[]} allBundles
 * @returns
 */
function CreateAllBundles(results, budget, currBundle, currTotal, currRec, allBundles){
    // base case #1: budget exceeded
    if (currTotal > budget){
        return;
    }
    // base case #2: no more items to add
    if (Object.keys(results).length == 0){
        allBundles.push([currTotal, currRec, ...currBundle]);
        return;
    }
    // get first query in results
    const [query, matches] = Object.entries(results)[0];
    // recursively explore options
    matches.forEach(match => {
        currBundle.push(match.original);
        currTotal += match.original.price;
        currRec += match.original.recommend_score;
        const newResults = {...results};
        delete newResults[query];
        CreateAllBundles(newResults, budget, currBundle, currTotal, currRec, allBundles);
        currTotal -= match.original.price;
        currRec -= match.original.recommend_score;
        currBundle.pop();
    });
}

/**
 * Finds the items with similar names to the item passed in
 * @param {String} item
 * @param {Object[]} listItems
 * @returns {Object[]}
 */
function FindSimilarItems(item, listItems){
    var options = {
        extract: function(item) { return item.name; }
    }
    var results = fuzzy.filter(item, listItems, options);
    return results;
}
