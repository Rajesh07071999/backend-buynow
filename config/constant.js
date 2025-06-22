import dotenv from "dotenv";
process.env.STAGE = process.env.STAGE || "development";
if (process.env.STAGE === "development") {
  dotenv.config({ path: ".env.development" });
} else if (process.env.STAGE === "production") {
  dotenv.config({ path: ".env" });
}
dotenv.config();
const GLOBALS = {
  PORT: process.env.PORT,
  APP_NAME: process.env.APP_NAME,
  KEY: process.env.KEY,
  IV: process.env.IV,
  API_KEY_ORIGINAL: process.env.API_KEY,
  DB_URL: process.env.DB_URL,
  JWT_SECRET: process.env.JWT_SECRET
};


export default GLOBALS;
