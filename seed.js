import { PrismaClient } from './generated/prisma/index.js'
import { hashPassword, verifyPassword } from './api/bcrypt.js';
const prisma = new PrismaClient()
const fakeData = {
  users: [
    {
      email: "pikachu@gmail.com",
      username: "pikachu",
      password: "pikachu",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
      bio: "Pikachu",
      location: '{"lat": 37.8044, "lng": -122.2711}'
    },
    {
      email: "charizard@gmail.com",
      username: "charizard",
      password: "charizard",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      bio: "Charizard",
      location: '{"lat": 37.6879, "lng": -122.4702}'
    },
    {
      email: "eevee@gmail.com",
      username: "eevee",
      password: "eevee",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
      bio: "Eevee",
      location: '{"lat": 37.4419, "lng": -122.1430}'
    },
    {
      email: "mewtwo@gmail.com",
      username: "mewtwo",
      password: "mewtwo",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
      bio: "Mewtwo",
      location: '{"lat": 38.1041, "lng": -122.2566}'
    },
    {
      email: "jigglypuff@gmail.com",
      username: "jigglypuff",
      password: "jigglypuff",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
      bio: "Jigglypuff",
      location: '{"lat": 36.9741, "lng": -122.0308}'
    }
  ],

  posts: [
    {
      "price": 129.99,
      "category": 0,
      "name": "Smart Microwave Oven",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.8044, \"lng\": -122.2711}",    // Oakland (~8 miles)
      "description": "A sleek, modern microwave with smart features and voice control.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565221/microwave_rwntzs.jpg",
      "condition": "New",
      "brand": "MicroTech",
      "color": "Silver",
      "authorId": 1
    },
    {
      "price": 299.99,
      "category": 1,
      "name": "Electric Scooter X200",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.6879, \"lng\": -122.4702}",    // Daly City (~10 miles)
      "description": "High-speed electric scooter with a 25-mile range.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565212/electric_scooter_r8gzzy.jpg",
      "condition": "Like New",
      "brand": "EcoRide",
      "color": "Red",
      "authorId": 2
    },
    {
      "price": 49.99,
      "category": 2,
      "name": "Non-Stick Frying Pan",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.4419, \"lng\": -122.1430}",    // Palo Alto (~33 miles)
      "description": "Durable non-stick frying pan for everyday cooking.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565317/pan-554072_1280_pxwc0z.jpg",
      "condition": "Good",
      "brand": "CookMaster",
      "color": "Black",
      "authorId": 3
    },
    {
      "price": 199.99,
      "category": 3,
      "name": "Memory Foam Mattress Topper",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 38.1041, \"lng\": -122.2566}",    // Santa Rosa (~56 miles, a bit further but close enough)
      "description": "Enhance your sleep with this comfortable memory foam topper.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565361/comfort-8069094_1280_bh7jod.jpg",
      "condition": "Fair",
      "brand": "SleepWell",
      "color": "Blue",
      "authorId": 4
    },
    {
      "price": 15.99,
      "category": 4,
      "name": "Djungelskog Plush Bear",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.3382, \"lng\": -121.8863}",    // San Jose (~48 miles)
      "description": "Soft and cuddly plush bear from the Djungelskog collection.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565480/giant-teddy-4353077_1280_rg0xww.jpg",
      "condition": "Unspecified",
      "brand": "IKEA",
      "color": "Brown",
      "authorId": 5
    },
    {
      "price": 12.99,
      "category": 5,
      "name": "Collapsible Laundry Basket",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.8715, \"lng\": -122.2730}",    // Berkeley (~9 miles)
      "description": "Space-saving laundry basket that folds flat when not in use.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565564/laundry-basket-59654_1280_q8kxk7.jpg",
      "condition": "New",
      "brand": "HomeBasics",
      "color": "Blue",
      "authorId": 1
    },
    {
      "price": 29.99,
      "category": 6,
      "name": "Cotton T-Shirt",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.0819}",    // Fremont (~22 miles)
      "description": "Soft cotton t-shirt available in various sizes.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751565640/t-shirt-1278404_640_grbw9s.jpg",
      "condition": "Like New",
      "brand": "FashionCo",
      "color": "White",
      "authorId": 2
    },
    {
      "price": 89.99,
      "category": 7,
      "name": "Ergonomic Office Chair",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.6872, \"lng\": -122.4702}",    // Daly City (~10 miles)
      "description": "Comfortable office chair with lumbar support and adjustable height.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566102/effydesk-TIOGOV5ZQzA-unsplash_bsujya.jpg",
      "condition": "Good",
      "brand": "WorkComfort",
      "color": "Silver",
      "authorId": 3
    },
    {
      "price": 24.99,
      "category": 8,
      "name": "LED Desk Lamp",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.8044, \"lng\": -122.2712}",    // Oakland (~8 miles)
      "description": "Energy-efficient LED desk lamp with adjustable brightness.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566187/oscar-ivan-esquivel-arteaga-at5-1nW3UCY-unsplash_jtwxsw.jpg",
      "condition": "Fair",
      "brand": "BrightLight",
      "color": "Pink",
      "authorId": 4
    },
    {
      "price": 5.99,
      "category": 9,
      "name": "Reusable Shopping Bag",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.8049, \"lng\": -122.2694}",    // Oakland (~7.5 miles)
      "description": "Eco-friendly reusable shopping bag made from recycled materials.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566265/ginny-rose-stewart-_kUCAyYFVBI-unsplash_p0pfvn.jpg",
      "condition": "Unspecified",
      "brand": "EcoGoods",
      "color": "White",
      "authorId": 5
    },
    {
      "price": 59.99,
      "category": 0,
      "name": "Smart LED Monitor",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",    // San Francisco (center)
      "description": "27-inch smart LED monitor with built-in speakers and Wi-Fi.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566321/rohit-KZnfwqi-B0U-unsplash_fajax3.jpg",
      "condition": "New",
      "brand": "VisionTech",
      "color": "Black",
      "authorId": 1
    },
    {
      "price": 79.99,
      "category": 1,
      "name": "Electric Bike ZR500",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.5629, \"lng\": -122.3255}",    // Redwood City (~20 miles)
      "description": "High-performance electric bike with a 50-mile range and top speed of 28 mph.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566355/himiway-bikes-jvNc-dwIISg-unsplash_fu2vpt.jpg",
      "condition": "Like New",
      "brand": "RideFast",
      "color": "Black",
      "authorId": 2
    },
    {
      "price": 19.99,
      "category": 0,
      "name": "Wireless Earbuds Pro",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",    // San Francisco (center)
      "description": "Premium wireless earbuds with noise cancellation and 30-hour battery life.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566411/daniel-romero-k6zPpoQhVX0-unsplash_yzxjrh.jpg",
      "condition": "Good",
      "brand": "SoundWave",
      "color": "White",
      "authorId": 1
    },
    {
      "price": 59.99,
      "category": 1,
      "name": "Foldable Electric Scooter",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.6875, \"lng\": -122.4700}",    // Daly City (~10 miles)
      "description": "Compact and foldable electric scooter with a 15-mile range.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566455/yiting-he-CorgaWm5Arc-unsplash_bhcnap.jpg",
      "condition": "Fair",
      "brand": "UrbanRide",
      "color": "Black",
      "authorId": 2
    },
    {
      "price": 39.99,
      "category": 2,
      "name": "Cast Iron Skillet",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.4419, \"lng\": -122.1431}",    // Palo Alto (~33 miles)
      "description": "Pre-seasoned cast iron skillet perfect for searing, sautéing, baking, broiling, braising, frying, and more.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566506/james-kern-qufi5Rm9j2U-unsplash_munpva.jpg",
      "condition": "Unspecified",
      "brand": "GrillMaster",
      "color": "Black",
      "authorId": 3
    },
    {
      "price": 129.99,
      "category": 3,
      "name": "Adjustable Bed Frame",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.8043, \"lng\": -122.2710}",    // Oakland (~8 miles)
      "description": "Adjustable bed frame with wireless remote and USB charging ports.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566635/indoor-4148891_1280_tvuk7v.jpg",
      "condition": "New",
      "brand": "SleepTech",
      "color": "Blue",
      "authorId": 4
    },
    {
      "price": 89.99,
      "category": 8,
      "name": "Smart LED Desk Lamp",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.8716, \"lng\": -122.2727}",    // Berkeley (~9 miles)
      "description": "Adjustable smart LED desk lamp with touch controls and color temperature settings.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566671/james-coleman-yxgZAm6kYQo-unsplash_ybwr9v.jpg",
      "condition": "Like New",
      "brand": "LumaTech",
      "color": "White",
      "authorId": 5
    },
    {
      "price": 39.99,
      "category": 9,
      "name": "Stainless Steel Water Bottle",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.3382, \"lng\": -121.8863}",    // San Jose (~48 miles)
      "description": "Durable stainless steel water bottle with double-wall insulation to keep drinks cold or hot.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566718/personalgraphic-com-OUjR8lrGccs-unsplash_sscqjd.jpg",
      "condition": "Good",
      "brand": "HydroFlask",
      "color": "White",
      "authorId": 1
    },
    {
      "price": 249.99,
      "category": 0,
      "name": "4K Ultra HD Smart TV",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.5628, \"lng\": -122.3256}",    // Redwood City (~20 miles)
      "description": "55-inch 4K Ultra HD Smart TV with built-in Wi-Fi and streaming apps.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566758/boliviainteligente-zULmo_Yxu-0-unsplash_mbyuxd.jpg",
      "condition": "Fair",
      "brand": "Visionary",
      "color": "Black",
      "authorId": 2
    },
    {
      "price": 159.99,
      "category": 1,
      "name": "Electric Scooter ZR300",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.6870, \"lng\": -122.4701}",    // Daly City (~10 miles)
      "description": "High-performance electric scooter with a 30-mile range and top speed of 20 mph.",
      "image_url": "https://res.cloudinary.com/doeql5cyb/image/upload/v1751566801/martin-katler-SwWewDn3CG4-unsplash_ssxuaz.jpg",
      "condition": "Unspecified",
      "brand": "RideFast",
      "color": "Red",
      "authorId": 3
    }
  ]
};

async function main() {
  /*for (const user of fakeData.users) {
    const newUser = user;
        //hash password
        const hash = await hashPassword(newUser.password)
        //create user
        const created = await prisma.user.create({
            data: {...newUser, password: hash}
        })
      }*/
  for (const post of fakeData.posts){
    const newPost = post;
        //create post
        const created = await prisma.post.create({data:newPost})
  }
}

async function resetDatabase() {
  await prisma.post.deleteMany()
  //await prisma.user.deleteMany()
}

resetDatabase();


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
