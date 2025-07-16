import fuzzy from 'fuzzy';

//Test Data
const items =
[
    {
      "item_id": 1,
      "item_name": "Modern Desk Lamp",
      "recommend_score": 0.4,
      "item_price": 49.99
    },
    {
      "item_id": 2,
      "item_name": "LED Table Lamp",
      "recommend_score": 0.9,
      "item_price": 52.00
    },
    {
      "item_id": 3,
      "item_name": "Minimalist Floor Lamp",
      "recommend_score": 0.1,
      "item_price": 30.75
    },
    {
      "item_id": 4,
      "item_name": "Classic Wood Bedframe",
      "recommend_score": 0.3,
      "item_price": 229.00
    },
    {
      "item_id": 5,
      "item_name": "Oak Frame Bed",
      "recommend_score": 0.6,
      "item_price": 270.25
    },
    {
      "item_id": 6,
      "item_name": "Compact Metal Bed Frame",
      "recommend_score": 0.9,
      "item_price": 300.80
    },
    {
      "item_id": 7,
      "item_name": "Three-Seater Couch",
      "recommend_score": 0.8,
      "item_price": 580.50
    },
    {
      "item_id": 8,
      "item_name": "Deluxe Fabric Couch",
      "recommend_score": 0.9,
      "item_price": 550.00
    },
    {
      "item_id": 9,
      "item_name": "Modern Living Room Couch",
      "recommend_score": 0.5,
      "item_price": 505.00
    }
]

async function calculateBundle(itemQueries, budget){
    let results = {};
    // find all items that match each query
    for (let i = 0; i < itemQueries.length; i++) {
        results[itemQueries[i]] = FindSimilarItems(itemQueries[i], items);
    }
    // get cheapest bundle
    let cheapestBundle = GetCheapestBundle(results, budget);

    //get most recommended bundle
    let recommendedBundle = GetMostRecommendedBundle(results, budget);

    return {cheapestBundle, recommendedBundle};
}

function GetCheapestBundle(results, budget){
    // get cheapest bundle
    let bundle = [];
    let total = 0;
    const priceCompare = (itemA, itemB) => itemA.item_price - itemB.item_price;
    Object.entries(results).forEach(([query, matches]) => {
       // create object list
       let items = [];
       for (let i = 0; i < matches.length; i++) {
           items.push(matches[i].original);
       }
       // sort by price
       items.sort(priceCompare);

       // add to bundle
       bundle.push(items[0]);
       total += items[0].item_price;
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
        currTotal += match.original.item_price;
        currRec += match.original.recommend_score;
        const newResults = {...results};
        delete newResults[query];
        CreateAllBundles(newResults, budget, currBundle, currTotal, currRec, allBundles);
        currTotal -= match.original.item_price;
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
        extract: function(item) { return item.item_name; }
    }
    var results = fuzzy.filter(item, listItems, options);
    return results;
}

// Test Cases
calculateBundle(['lamp', 'couch'], 540);
