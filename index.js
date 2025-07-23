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
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(
  expressSession({
    name: "cookie",
    cookie: { path: "/", httpOnly: false, secure: false },
    secret: "temporary secret",
    resave: false,
    saveUninitialized: false,
  }),
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
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post("/uploadImage", (req, res) => {
  uploadImage(req.body.image)
    .then((url) => res.json({ url: url }))
    .catch((err) => res.status(500).json({ error: err.message || err }));
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
