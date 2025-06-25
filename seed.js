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
      price: 12.5,
      category: "Collectible",
      name: "Pikachu Plush Toy",
      time_created: "1730000000",
      time_sold: null,
      location: "Oakland, CA",
      description: "Soft Pikachu plush, great condition!",
      image_url: "https://picsum.photos/200/300",
      condition: "Like New",
      brand: "PokéMall",
      color: "Yellow",
      authorId: 1
    },
    {
      price: 45.0,
      category: "Game Card",
      name: "Charizard Holo Card",
      time_created: "1729500000",
      time_sold: "1729550000",
      location: "San Francisco, CA",
      description: null,
      image_url: "https://picsum.photos/200/300",
      condition: "Excellent",
      brand: null,
      color: null,
      authorId: 2
    },
    {
      price: 25.75,
      category: "Apparel",
      name: "Eevee T‑Shirt",
      time_created: "1729000000",
      time_sold: null,
      location: "Berkeley, CA",
      description: "Cool Eevee graphic tee, size M.",
      image_url: null,
      condition: "Good",
      brand: "PokéWear",
      color: "White",
      authorId: 3
    },
    {
      price: 5.0,
      category: "Accessory",
      name: "Mewtwo Keychain",
      time_created: "1728600000",
      time_sold: "1728700000",
      location: "Oakland, CA",
      description: "Mewtwo keychain, metallic finish.",
      image_url: null,
      condition: null,
      brand: "Team Rocket",
      color: "Purple",
      authorId: 4
    },
    {
      price: 30.0,
      category: "Toy",
      name: "Jigglypuff Mic Plush",
      time_created: "1728200000",
      time_sold: null,
      location: "San Jose, CA",
      description: null,
      image_url: "https://picsum.photos/200/300",
      condition: "New",
      brand: "PokéSound",
      color: null,
      authorId: 5
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
