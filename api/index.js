import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./routes/auth.route.js";
import morgan from "morgan";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoute);

app.listen(3000, () => {
  console.log(`Server is running on port 3000!`);
});
