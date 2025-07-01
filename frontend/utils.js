const category = {
  "Electronics": 0,
  "Transportation": 1,
  "Kitchen": 2,
  "Bedroom": 3,
  "Toys/Collectibles": 4,
  "Bathroom": 5,
  "Clothing": 6,
  "Furniture": 7,
  "Decor": 8,
  "Other": 9,
  "All": 10,
}
export const categoryArr = Object.keys(category);

export function GetCategoryIdByName(name){
    return category[name];
}

export const color = {
    "White": 0,
    "Black": 1,
    "Red": 2,
    "Orange": 3,
    "Yellow": 4,
    "Green": 5,
    "Blue": 6,
    "Purple": 7,
    "Pink": 8,
    "Brown": 9,
    "Silver": 10,
    "Gold": 11,
    "Other": 12,
    "All": 13,
}

export const colorArr = Object.keys(color);

export function GetColorIdByName(name){
    return color[name];
}

export const condition = {
    "New": 0,
    "Like New": 1,
    "Good": 2,
    "Fair": 3,
    "Unspecified": 4,
    "All": 5,
}

export const conditionArr = Object.keys(condition);

export function GetConditionIdByName(name){
    return condition[name];
}
