import fuzzy from "fuzzy";
import { getRecommendations as getRecommendations } from "./recommended.js";

const priorityWeights = {
  High: 10,
  Medium: 1,
  Low: 0.1,
};
export async function calculateBundles(
  posts,
  itemQueries,
  budget,
  user_id,
  priorities
) {
  let results = {};
  // find all items that match each query
  for (let i = 0; i < itemQueries.length; i++) {
    const similarItems = findSimilarItems(itemQueries[i], posts);
    // if no items found for a query, remove the query
    if (similarItems.length == 0) {
      itemQueries.splice(i, 1);
    } else {
      results[itemQueries[i]] = similarItems;
    }
  }

  // get cheapest bundle
  let cheapestBundle = getCheapestBundle(results, budget);

  // match items to recommendations
  const recommendations = await getRecommendations(user_id, posts.length);
  posts.forEach((post) => {
    recommendations.forEach((recommendation) => {
      // if post id matches recommendation id and score is not null, set recommend score
      post.id == recommendation[0] &&
        (recommendation[1] != null
          ? (post.recommend_score = recommendation[1])
          : (post.recommend_score = 0));
    });
    if (!post.recommend_score) {
      post.recommend_score = 5;
    }
  });
  const items = transformDataToObjects(results);
  // map query to priority
  const queryToPriority = {};
  for (let i = 0; i < itemQueries.length; i++) {
    queryToPriority[itemQueries[i]] = priorities[i];
  }
  // weigh recommendations by priorities
  for (let i = 0; i < items.length; i++) {
    if (queryToPriority[items[i].query]) {
      items[i].recommend_score *=
        priorityWeights[queryToPriority[items[i].query]];
    }
  }
  const oneBundle = getOneBundle2D(items, budget);

  return { cheapestBundle: cheapestBundle, bestValueBundle: oneBundle.items };
}

function getCheapestBundle(results, budget) {
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
    items = items.filter(item => !bundle.includes(item));

    if (items.length > 0){
      bundle.push(items[0]);
      total += items[0].price;
    }
  });
  return total > budget ? null : bundle;
}

function transformDataToObjects(results) {
  const items = [];
  const usedItems = new Set();
  for (const [query, matches] of Object.entries(results)) {
    for (const match of matches) {
      if (usedItems.has(match.original.id)){
        continue;
      }
      const newItem = {
        ...match.original,
        priority: 1,
        query: query,
        price: Math.floor(match.original.price),
      };
      usedItems.add(match.original.id);
      items.push(newItem);
    }
  }
  return items;
}

function getOneBundle2D(items, budget) {
  // Instantiate a 2d Array
  // rows represent how many items there are
  // columns represent the price
  // table[i][j] is an object
  // recommend: the best bundle with i items and j price
  // items: the items in the best bundle
  if (items.length == 0){
    return {priority: 0, items: []};
  }
  const amountItems = items.length;
  const table = new Array(amountItems);
  for (let i = 0; i < amountItems; i++) {
    table[i] = [];
    for (let j = 0; j < budget + 1; j++) {
      table[i][j] = { priority: 0, items: [], usedQueries: new Set() };
    }
  }
  // Fill table
  for (let i = 0; i < amountItems; i++) {
    for (let j = 0; j < budget + 1; j++) {
      // priority if you include the item i
      let priorityInclude = { priority: 0, items: [], usedQueries: new Set() };
      if (items[i].price <= j) {
        let previousBundle;
        if (i > 0) {
          previousBundle = table[i - 1][j - items[i].price];
        } else {
          previousBundle = {
            priority: 0,
            items: [],
            usedQueries: new Set(),
          };
        }
        // if the item query has already been used, replace if the score is better
        const alreadyUsed = previousBundle.usedQueries.has(items[i].query);
        if (alreadyUsed) {
          const newItems = [...previousBundle.items];
          const sameQuery = newItems.find(
            (item) => item.query == items[i].query
          );
          if (sameQuery.recommend_score < items[i].recommend_score) {
            priorityInclude = {
              priority:
                previousBundle.priority +
                items[i].recommend_score -
                sameQuery.recommend_score,
              items: [
                ...newItems.filter((item) => item.query != items[i].query),
                items[i],
              ],
              usedQueries: new Set(previousBundle.usedQueries),
            };
          } else {
            priorityInclude = {
              priority: previousBundle.priority,
              items: [...previousBundle.items],
              usedQueries: new Set(previousBundle.usedQueries),
            };
          }
        } else {
          priorityInclude = {
            priority: items[i].recommend_score + previousBundle.priority,
            items: [...previousBundle.items, items[i]],
          };
          priorityInclude.usedQueries = new Set(previousBundle.usedQueries);
          priorityInclude.usedQueries.add(items[i].query);
        }
      }
      // priority if you exclude the item i
      const priorityExclude =
        i - 1 >= 0
          ? {
              priority: table[i - 1][j].priority,
              items: [...table[i - 1][j].items],
              usedQueries: new Set(table[i - 1][j].usedQueries),
            }
          : {
              priority: 0,
              items: [],
              usedQueries: new Set(),
            };
      if (priorityInclude.priority > priorityExclude.priority) {
        table[i][j] = priorityInclude;
      } else {
        table[i][j] = priorityExclude;
      }
    }
  }
  return table[amountItems - 1][budget];
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
function findSimilarItems(item, listItems) {
  var options = {
    extract: function (item) {
      return item.name;
    },
  };
  var results = fuzzy.filter(item, listItems, options);
  return results;
}
