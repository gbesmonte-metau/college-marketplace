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
    const items = TransformDataToObjects(results);
    const allBundles = [];
    GetAnyBundlesRecursion(items, {items: [], total: 0, priority: 0}, 0, new Set(), budget, allBundles);
    const sortedBundles = allBundles.sort((bundleA, bundleB) => bundleB.priority - bundleA.priority);
    return sortedBundles;
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
    const allBundles = CreateAllBundles2(results, budget);

    if (Object.keys(allBundles).length == 0){
        return null;
    }

    // sort by recommend score
    allBundles.sort((a, b) => b.recommended - a.recommended);

    return allBundles[0].bundle;
}

/**
 * Recursively creates all possible bundles
 * @param {Object} results
 * @param {Number} budget
 * @param {Object[]} currentBundle
 * @param {Number} currentTotal
 * @param {Number} currentRecommend
 * @param {Array[]} allBundles
 * @returns
 */
function CreateAllBundles(results, budget, currentBundle, currentTotal, currentRecommend, allBundles){
    // base case #1: budget exceeded
    if (currentTotal > budget){
        return;
    }
    // base case #2: no more items to add
    if (Object.keys(results).length == 0){
        allBundles.push({currentTotal, currentRecommend, currentBundle});
        return;
    }
    // get first query in results
    const [query, matches] = Object.entries(results)[0];
    // recursively explore options
    matches.forEach(match => {
        currentTotal += match.original.price;
        currentRecommend += match.original.recommend_score;
        const newResults = {...results};
        delete newResults[query];
        const newBundle = [...currentBundle, match.original];
        CreateAllBundles(newResults, budget, newBundle, currentTotal, currentRecommend, allBundles);
        currentTotal -= match.original.price;
        currentRecommend -= match.original.recommend_score;
    });
}

/**
 * Recursively generates all possible bundles
 * @param {Object[]} results
 * @param {Number} budget
 * @returns
 */
function CreateAllBundles2(results, budget){
    //Base Case: if results are empty
    if (Object.keys(results).length == 0){
        return [{price: 0, recommended: 0, bundle: []}];
    }
    const [query, matches] = Object.entries(results)[0];
    const newResults = {...results};
    delete newResults[query];
    const combinations = CreateAllBundles2(newResults, budget);
    const newCombinations = [];
    for (const c of combinations){
        for (const match of matches){
            if (c.price + match.original.price <= budget){
                 newCombinations.push({price: c.price + match.original.price, recommended: c.recommended + match.original.recommend_score, bundle: [...c.bundle, match.original]});
            }
        }
    }
    return newCombinations;
}

function TransformDataToObjects(results){
    const items = [];
    for (const [query, matches] of Object.entries(results)){
        for (const match of matches){
            const newItem = {
                ...match.original,
                priority: 1,
                query: query
            }
            items.push(newItem);
        }
    }
    return items;
}

/**
 *  Return all bundles, even if partial
 *  All bundles are under budget
 * @param {Object[]} items
 * @param {Object} currentBundle
 * @param {Number} index
 * @param {Set} usedQueries
 * @param {Number} budget
 * @param {Object[]} allBundles
 * @returns
 */
function GetAnyBundlesRecursion(items, currentBundle, index, usedQueries, budget, allBundles){
    // Move up index until we find a query that hasn't been used yet
    while (index < items.length && usedQueries.has(items[index].query)){
        index++;
    }
    // Base Case: if over budget
    if (currentBundle.total > budget){
        return;
    }
    // Base Case: if no more items are left
    if (index == items.length){
        allBundles.push(currentBundle)
        return;
    }
    // Recursive Case: explore two cases, one with object and one without
    // Case 1
    const newCurrentBundle = {...currentBundle};
    newCurrentBundle.items = [...currentBundle.items, items[index]];
    newCurrentBundle.total += items[index].price;
    newCurrentBundle.priority += items[index].priority;
    const newQueries = new Set(usedQueries);
    newQueries.add(items[index].query);
    GetAnyBundlesRecursion(items, newCurrentBundle, index + 1, newQueries, budget, allBundles);
    // Case 2
    GetAnyBundlesRecursion(items, currentBundle, index + 1, usedQueries, budget, allBundles);
}



/**
 * Finds the items with similar names to the item passed in
 * Fuzzy returns:
 * - string: the matched string
 * - score: the score of the match
 * - index: the index of the match
 * - original: the original item
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
