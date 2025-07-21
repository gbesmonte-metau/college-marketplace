import fuzzy from "fuzzy";
import { GetRecommendations } from "./recommended.js";

//Test Data
const tempItems = [
  {
    id: 1,
    name: "Modern Desk Lamp",
    recommend_score: 0.4,
    price: 10,
  },
  {
    id: 2,
    name: "LED Table Lamp",
    recommend_score: 0.9,
    price: 10,
  },
  {
    id: 3,
    name: "Minimalist Floor Lamp",
    recommend_score: 0.1,
    price: 10,
  },
  {
    id: 4,
    name: "Classic Wood Bedframe",
    recommend_score: 0.3,
    price: 20,
  },
  {
    id: 5,
    name: "Oak Frame Bed",
    recommend_score: 0.6,
    price: 20,
  },
  {
    id: 6,
    name: "Compact Metal Bed Frame",
    recommend_score: 0.9,
    price: 2,
  },
  {
    id: 7,
    name: "Three-Seater Couch",
    recommend_score: 0.8,
    price: 1,
  },
  {
    id: 8,
    name: "Deluxe Fabric Couch",
    recommend_score: 0.9,
    price: 15,
  },
  {
    id: 9,
    name: "Modern Living Room Couch",
    recommend_score: 0.5,
    price: 15,
  },
];

export async function CalculateBundles(posts, itemQueries, budget, user_id) {
  let results = {};
  // find all items that match each query
  for (let i = 0; i < itemQueries.length; i++) {
    const similarItems = FindSimilarItems(itemQueries[i], posts);
    // if no items found for a query, remove the query
    if (similarItems.length == 0) {
      itemQueries.splice(i, 1);
    } else {
      results[itemQueries[i]] = similarItems;
    }
  }

  // get cheapest bundle
  let cheapestBundle = GetCheapestBundle(results, budget);

  // match items to recommendations
  const recommendations = await GetRecommendations(user_id, posts.length);
  posts.forEach((post) => {
    recommendations.forEach((recommendation) => {
      // if post id matches recommendation id and score is not null, set recommend score
      post.id == recommendation[0] &&
        (recommendation[1] != null
          ? (post.recommend_score = recommendation[1])
          : (post.recommend_score = 0));
    });
  });

  const items = TransformDataToObjects(results);
  const oneBundle = GetOneBundle2D(items, budget);

  return { cheapestBundle: cheapestBundle, bestValueBundle: oneBundle.items };
}

function GetCheapestBundle(results, budget) {
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

function TransformDataToObjects(results) {
  const items = [];
  for (const [query, matches] of Object.entries(results)) {
    for (const match of matches) {
      const newItem = {
        ...match.original,
        priority: 1,
        query: query,
        price: Math.floor(match.original.price),
      };
      items.push(newItem);
    }
  }
  return items;
}

function GetOneBundle2D(items, budget) {
  // Instantiate a 2d Array
  // rows represent how many items there are
  // columns represent the price
  // table[i][j] is an object
  // recommend: the best bundle with i items and j price
  // items: the items in the best bundle
  const amountItems = items.length;
  const table = new Array(amountItems + 1);
  for (let i = 0; i < amountItems + 1; i++) {
    table[i] = [];
    for (let j = 0; j < budget + 1; j++) {
      table[i][j] = { priority: 0, items: [], usedQueries: new Set() };
    }
  }
  // Fill table
  for (let i = 1; i < amountItems + 1; i++) {
    for (let j = 1; j < budget + 1; j++) {
      // priority if you include the item i
      let priorityInclude = 0;
      let alreadyUsed = false;
      let willReplace = false;
      let newUsedQueries = new Set();
      if (items[i - 1].price <= j) {
        newUsedQueries = new Set(
          table[i - 1][j - items[i - 1].price].usedQueries,
        );
        // if the item query has already been used, replace if the score is better
        alreadyUsed = table[i - 1][j - items[i - 1].price].usedQueries.has(
          items[i - 1].query,
        );
        if (alreadyUsed) {
          const newItems = [...table[i - 1][j - items[i - 1].price].items];
          const sameQuery = newItems.find(
            (item) => item.query == items[i - 1].query,
          );
          if (sameQuery.recommend_score < items[i - 1].recommend_score) {
            priorityInclude =
              table[i - 1][j - items[i - 1].price].priority +
              items[i - 1].recommend_score -
              sameQuery.recommend_score;
            willReplace = true;
          }
        } else {
          priorityInclude =
            items[i - 1].recommend_score +
            table[i - 1][j - items[i - 1].price].priority;
          newUsedQueries.add(items[i - 1].query);
        }
      }
      // priority if you exclude the item i
      const priorityExclude = table[i - 1][j].priority;
      // choose the maximum priority
      if (priorityInclude > priorityExclude) {
        let newItems = [...table[i - 1][j - items[i - 1].price].items];
        if (alreadyUsed && willReplace) {
          newItems = newItems.filter(
            (item) => item.query != items[i - 1].query,
          );
          newItems.push(items[i - 1]);
        } else if (alreadyUsed) {
          // do nothing
        } else {
          newItems.push(items[i - 1]);
        }
        table[i][j] = {
          priority: priorityInclude,
          items: newItems,
          usedQueries: newUsedQueries,
        };
      } else {
        table[i][j] = {
          priority: priorityExclude,
          items: [...table[i - 1][j].items],
          usedQueries: new Set(table[i - 1][j].usedQueries),
        };
      }
    }
  }
  return table[amountItems][budget];
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
function FindSimilarItems(item, listItems) {
  var options = {
    extract: function (item) {
      return item.name;
    },
  };
  var results = fuzzy.filter(item, listItems, options);
  return results;
}
