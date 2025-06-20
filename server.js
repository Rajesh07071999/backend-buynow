import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import ejs from "ejs";
import dotenv from "dotenv";
import logger from "./logger.js";
import database from "./config/database.js";
import adminRoute from "./modules/v1/admin/route_manager.js";
import userRoute from "./modules/v1/user/route_manager.js"

dotenv.config();
const app = express();


app.use(cors());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(bodyParser.text({ limit: "100mb" }));
app.use(cookieParser());
app.use(express.text({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

app.engine("html", ejs.renderFile);
app.set("view engine", "html");




app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});


app.use("/api/v1/admin/", adminRoute);
app.use("/api/v1/user/", userRoute);

app.get("/read/:fileName", function (req, res) {
  res.sendFile(__dirname + '/uploads/' + req.params.fileName)
})


//server connection
try {
    app.listen(process.env.PORT);
    logger.info('Server running : ' + process.env.PORT);
} catch (error) {
    logger.error('fail');
}
 
 