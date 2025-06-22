import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ejs from "ejs";
import dotenv from "dotenv";
import logger from "./logger.js";
import database from "./config/database.js";
import adminRoute from "./modules/v1/admin/route_manager.js";
import userRoute from "./modules/v1/user/route_manager.js";

dotenv.config();
const app = express();

// ✅ CORS setup to allow only Vercel frontend
const allowedOrigins = [
  "https://admin-buynow.vercel.app",
  "http://localhost:3000"
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

// Body parsers
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

// Static & view engine
app.use(express.static("public"));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

// Routes
app.use("/api/v1/admin/", adminRoute);
app.use("/api/v1/user/", userRoute);
app.get("/read/:fileName", function (req, res) {
  res.sendFile(__dirname + '/uploads/' + req.params.fileName);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.message);
  res.status(500).send("Something went wrong!");
});

// Start server
try {
  app.listen(process.env.PORT, () => {
    logger.info('Server running : ' + process.env.PORT);
  });
} catch (error) {
  logger.error('Failed to start server:', error);
}
