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
