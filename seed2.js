import dotenv from "dotenv";
dotenv.config();
import { promises as fs } from "fs";
import { parse } from "csv-parse/sync";
import { categoryArr, GetCategoryIdByName } from "./frontend/utils.js";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

const uploadImageByUrl = (url) => {
  return new Promise((resolve, reject) => {
    console.log(cloudinary.config)
    cloudinary.uploader.upload(url, opts, (error, result) => {
      if (result && result.secure_url) {
        return resolve(result.secure_url);
      }
      return reject({ message: error.message });
    });
  });
};

const dirnames = ["./data/Electronics.csv", "./data/Transportation.csv", "./data/Kitchen.csv", "./data/Bedroom.csv", "./data/Toys.csv", "./data/Bathroom.csv", "./data/Clothing.csv", "./data/Furniture.csv", "./data/Decor.csv"];
const californiaLatLong = "./data/cal_cities_lat_long.csv"

let selectedData = []
let posts = []

async function processCSV(fileName){
    const content = await fs.readFile(fileName, 'utf-8');
    const data = parse(content, {
        columns: true,
        delimiter: ",",
    });
    return data;
};

async function chooseRandom(data, category){
    let count = 0;
    const amount = 1; //number of items to choose from each category
    while (count < amount) {
        const randomInt = Math.floor(Math.random() * data.length);
        const selectedItem = { ...data[randomInt], category: category };
        if (selectedItem.image.includes("IMAGERENDERING")){ //some data is corrupted
            continue;
        }
        selectedData.push(selectedItem);
        count++;
    }
}

async function convertToPost(data, cities){
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const cleanPrice = data.actual_price ? data.actual_price.replace(/₹|,/g, '') : '0';
    //upload image
    let image = data.image;
    try{
        image = await uploadImageByUrl(data.image);
    }
    catch(e){
        console.log(e);
    }
    console.log(image);
    const newPost = {
        price: parseFloat((parseFloat(cleanPrice) / 85.83167).toFixed(2)),
        category: GetCategoryIdByName(data.category),
        name: data.name,
        time_created: Date.now().toString(),
        location: `{\"lat\": ${randomCity.Latitude}, \"lng\": ${randomCity.Longitude}}`,
        formatted_address: randomCity.Name + ", California, United States",
        image_url: data.image,
        authorId: Math.floor(Math.random() * 5),
    }
    return newPost;
}

async function main(){
    //fill selectedData
    for (let i = 0; i < dirnames.length; i++) {
        const data = await processCSV(dirnames[i]);
        chooseRandom(data, categoryArr[i]);
    }
    const cities = await processCSV(californiaLatLong);
    for (let i = 0; i < selectedData.length; i++) {
        const post = await convertToPost(selectedData[i], cities);
        posts.push(post);
    }
    //write file
    const jsonString = JSON.stringify(posts, null, 2); // Pretty-print with 2-space indentation

    fs.writeFile('./data/data.json', jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }
        console.log('JSON data written to data.json successfully!');
    });
}

main();
