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
      bio: "Pikachu"
    },
    {
      email: "charizard@gmail.com",
      username: "charizard",
      password: "charizard",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
      bio: "Charizard"
    },
    {
      email: "eevee@gmail.com",
      username: "eevee",
      password: "eevee",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
      bio: "Eevee"
    },
    {
      email: "mewtwo@gmail.com",
      username: "mewtwo",
      password: "mewtwo",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/150.png",
      bio: "Mewtwo"
    },
    {
      email: "jigglypuff@gmail.com",
      username: "jigglypuff",
      password: "jigglypuff",
      icon: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
      bio: "Jigglypuff"
    }
  ],

  posts: [
    {
      "price": 129.99,
      "category": 1,
      "name": "Smart Microwave Oven",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "A sleek, modern microwave with smart features and voice control.",
      "image_url": "https://picsum.photos/200/300?random=1",
      "condition": "NEW",
      "brand": "MicroTech",
      "color": "Silver",
      "authorId": 1
    },
    {
      "price": 299.99,
      "category": 2,
      "name": "Electric Scooter X200",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "High-speed electric scooter with a 25-mile range.",
      "image_url": "https://picsum.photos/200/300?random=2",
      "condition": "NEW",
      "brand": "EcoRide",
      "color": "Black",
      "authorId": 2
    },
    {
      "price": 49.99,
      "category": 3,
      "name": "Non-Stick Frying Pan",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Durable non-stick frying pan for everyday cooking.",
      "image_url": "https://picsum.photos/200/300?random=3",
      "condition": "NEW",
      "brand": "CookMaster",
      "color": "Red",
      "authorId": 3
    },
    {
      "price": 199.99,
      "category": 4,
      "name": "Memory Foam Mattress Topper",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Enhance your sleep with this comfortable memory foam topper.",
      "image_url": "https://picsum.photos/200/300?random=4",
      "condition": "NEW",
      "brand": "SleepWell",
      "color": "White",
      "authorId": 4
    },
    {
      "price": 15.99,
      "category": 5,
      "name": "Djungelskog Plush Bear",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Soft and cuddly plush bear from the Djungelskog collection.",
      "image_url": "https://picsum.photos/200/300?random=5",
      "condition": "NEW",
      "brand": "IKEA",
      "color": "Brown",
      "authorId": 5
    },
    {
      "price": 12.99,
      "category": 6,
      "name": "Collapsible Laundry Basket",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Space-saving laundry basket that folds flat when not in use.",
      "image_url": "https://picsum.photos/200/300?random=6",
      "condition": "NEW",
      "brand": "HomeBasics",
      "color": "Blue",
      "authorId": 1
    },
    {
      "price": 29.99,
      "category": 7,
      "name": "Cotton T-Shirt",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Soft cotton t-shirt available in various sizes.",
      "image_url": "https://picsum.photos/200/300?random=7",
      "condition": "NEW",
      "brand": "FashionCo",
      "color": "White",
      "authorId": 2
    },
    {
      "price": 89.99,
      "category": 8,
      "name": "Ergonomic Office Chair",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Comfortable office chair with lumbar support and adjustable height.",
      "image_url": "https://picsum.photos/200/300?random=8",
      "condition": "NEW",
      "brand": "WorkComfort",
      "color": "Black",
      "authorId": 3
    },
    {
      "price": 24.99,
      "category": 9,
      "name": "LED Desk Lamp",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Energy-efficient LED desk lamp with adjustable brightness.",
      "image_url": "https://picsum.photos/200/300?random=9",
      "condition": "NEW",
      "brand": "BrightLight",
      "color": "Silver",
      "authorId": 4
    },
    {
      "price": 5.99,
      "category": 10,
      "name": "Reusable Shopping Bag",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Eco-friendly reusable shopping bag made from recycled materials.",
      "image_url": "https://picsum.photos/200/300?random=10",
      "condition": "NEW",
      "brand": "EcoGoods",
      "color": "Green",
      "authorId": 5
    },
    {
      "price": 59.99,
      "category": 1,
      "name": "Smart LED Monitor",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "27-inch smart LED monitor with built-in speakers and Wi-Fi.",
      "image_url": "https://picsum.photos/200/300?random=11",
      "condition": "NEW",
      "brand": "VisionTech",
      "color": "Black",
      "authorId": 1
    },
    {
      "price": 79.99,
      "category": 2,
      "name": "Electric Bike ZR500",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "High-performance electric bike with a 50-mile range and top speed of 28 mph.",
      "image_url": "https://picsum.photos/200/300?random=12",
      "condition": "NEW",
      "brand": "RideFast",
      "color": "Red",
      "authorId": 2
    },
    {
      "price": 19.99,
      "category": 1,
      "name": "Wireless Earbuds Pro",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Premium wireless earbuds with noise cancellation and 30-hour battery life.",
      "image_url": "https://picsum.photos/200/300?random=13",
      "condition": "NEW",
      "brand": "SoundWave",
      "color": "Black",
      "authorId": 1
    },
    {
      "price": 59.99,
      "category": 2,
      "name": "Foldable Electric Scooter",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Compact and foldable electric scooter with a 15-mile range.",
      "image_url": "https://picsum.photos/200/300?random=14",
      "condition": "NEW",
      "brand": "UrbanRide",
      "color": "Blue",
      "authorId": 2
    },
    {
      "price": 39.99,
      "category": 3,
      "name": "Cast Iron Skillet",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Pre-seasoned cast iron skillet perfect for searing, sautéing, baking, broiling, braising, frying, and more.",
      "image_url": "https://picsum.photos/200/300?random=15",
      "condition": "NEW",
      "brand": "GrillMaster",
      "color": "Black",
      "authorId": 3
    },
    {
      "price": 129.99,
      "category": 4,
      "name": "Adjustable Bed Frame",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Adjustable bed frame with wireless remote and USB charging ports.",
      "image_url": "https://picsum.photos/200/300?random=16",
      "condition": "NEW",
      "brand": "SleepTech",
      "color": "Gray",
      "authorId": 4
    },
    {
      "price": 89.99,
      "category": 9,
      "name": "Smart LED Desk Lamp",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Adjustable smart LED desk lamp with touch controls and color temperature settings.",
      "image_url": "https://picsum.photos/200/300?random=17",
      "condition": "NEW",
      "brand": "LumaTech",
      "color": "White",
      "authorId": 5
    },
    {
      "price": 39.99,
      "category": 10,
      "name": "Stainless Steel Water Bottle",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "Durable stainless steel water bottle with double-wall insulation to keep drinks cold or hot.",
      "image_url": "https://picsum.photos/200/300?random=18",
      "condition": "NEW",
      "brand": "HydroFlask",
      "color": "Black",
      "authorId": 1
    },
    {
      "price": 249.99,
      "category": 1,
      "name": "4K Ultra HD Smart TV",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "55-inch 4K Ultra HD Smart TV with built-in Wi-Fi and streaming apps.",
      "image_url": "https://picsum.photos/200/300?random=19",
      "condition": "NEW",
      "brand": "Visionary",
      "color": "Black",
      "authorId": 2
    },
    {
      "price": 159.99,
      "category": 2,
      "name": "Electric Scooter ZR300",
      "time_created": "1687785600",
      "time_sold": null,
      "location": "{\"lat\": 37.7749, \"lng\": -122.4194}",
      "description": "High-performance electric scooter with a 30-mile range and top speed of 20 mph.",
      "image_url": "https://picsum.photos/200/300?random=20",
      "condition": "NEW",
      "brand": "RideFast",
      "color": "Red",
      "authorId": 3
    }
  ]
};

async function main() {
  for (const user of fakeData.users) {
    const newUser = user;
        //hash password
        const hash = await hashPassword(newUser.password)
        //create user
        const created = await prisma.user.create({
            data: {...newUser, password: hash}
        })
      }
  for (const post of fakeData.posts){
    const newPost = post;
        //create post
        const created = await prisma.post.create({data:newPost})
  }
}

async function resetDatabase() {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
