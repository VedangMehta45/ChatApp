import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
const app = express();
dotenv.config();
app.use(express.json());
const PORT = process.env.PORT || 5001;
const URI = process.env.MONGODB_URI;
//Connecting to DB
try {
  mongoose.connect(URI).then(console.log("Mongodb Connected"));
} catch (error) {
  console.log(error);
}

//route
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Exapmle app listening on port ${PORT}`);
});
