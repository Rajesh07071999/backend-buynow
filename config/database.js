import mongoose from "mongoose";
import GLOBALS from "./constant.js";
mongoose.connect(GLOBALS.DB_URL, {
  //  useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     serverSelectionTimeoutMS: 30000,
  //     socketTimeoutMS: 45000
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Database Connected Successfully");
});

export default db; 
