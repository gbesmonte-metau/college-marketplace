const category = {
  "All": 0,
  "Electronics": 1,
  "Transportation": 2,
  "Kitchen": 3,
  "Bedroom": 4,
  "Toys/Collectibles": 5,
  "Bathroom": 6,
  "Clothing": 7,
  "Furniture": 8,
  "Decor": 9,
  "Other": 10,
}
export const categoryArr = Object.keys(category);

export function GetCategoryNameById(id){
    return categoryArr[id];
}

export function GetCategoryIdByName(name){
    return category[name];
}

export function GetCategoryArrLength(){
    return categoryArr.length;
}

export function GetCategoryArrToBool(){
    let dict = {};
    categoryArr.map((item) => {
        dict[item] = false;
    })
    return dict;
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
    "Gold": 11
}

export const colorArr = Object.keys(color);
