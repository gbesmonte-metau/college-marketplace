import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { router as userRouter } from "./api/user.js";
import { router as postRouter } from "./api/post.js";
import expressSession from "express-session";
import { uploadImage } from "./uploadImage.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));
app.set("trust proxy", 1);
const isProduction = process.env.NODE_ENV === "production";
app.use(cors({ credentials: true, origin: process.env.FRONTEND_URL }));
app.use(
  expressSession({
    name: "cookie",
    cookie: {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    },
    secret: "temporary secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(userRouter);
app.use(postRouter);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.FRONTEND_URL}`);
});

app.post("/uploadImage", async (req, res) => {
  let tags = [];
  try {
    const result = await uploadImage(req.body.image);
    const image = {
      url: result.secure_url,
    };
    if (result.info.categorization.google_tagging.data != null) {
      for (const tag of result.info.categorization.google_tagging.data) {
        tags.push(tag.tag);
      }
    }
    image["tags"] = tags;
    return res.status(200).json(image);
  } catch (e) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// [CATCH-ALL]
app.use("/*", (req, res, next) => {
  next({ status: 404, message: "Not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const { message, status = 500 } = err;
  res.status(status).json({ message });
});
