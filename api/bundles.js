import fuzzy from 'fuzzy';

//Test Data
const items =
[
    {
      "item_id": 1,
      "item_name": "Modern Desk Lamp",
      "item_price": 49.99
    },
    {
      "item_id": 2,
      "item_name": "LED Table Lamp",
      "item_price": 52.00
    },
    {
      "item_id": 3,
      "item_name": "Minimalist Floor Lamp",
      "item_price": 30.75
    },
    {
      "item_id": 4,
      "item_name": "Classic Wood Bedframe",
      "item_price": 229.00
    },
    {
      "item_id": 5,
      "item_name": "Oak Frame Bed",
      "item_price": 270.25
    },
    {
      "item_id": 6,
      "item_name": "Compact Metal Bed Frame",
      "item_price": 300.80
    },
    {
      "item_id": 7,
      "item_name": "Three-Seater Couch",
      "item_price": 580.50
    },
    {
      "item_id": 8,
      "item_name": "Deluxe Fabric Couch",
      "item_price": 550.00
    },
    {
      "item_id": 9,
      "item_name": "Modern Living Room Couch",
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
    let bundle = [];
    let total = 0;
    const priceCompare = (a, b) => a.item_price - b.item_price;
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

    // check if bundle is within budget
    if (total > budget) {
        return [];
    }
    else {
        return [bundle];
    }
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
