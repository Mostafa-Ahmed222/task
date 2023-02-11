import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
//set directory dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../config/.env") });

import mysql from "mysql2";
import { createClient } from "redis";

export const sql = mysql.createConnection({
  user: "root",
  password: "",
  database: "task",
  host: "localhost",
});
// connect mysql DB
export const connectDB = () => {
  sql.connect((err) => {
    if (err) {
      return console.log("fail to connect to DB");
    }
    return console.log("Connect to DB...........");
  });
};

// connect redis DB
export const redisClient = createClient({
  url: process.env.REDISURL,
});

export const ConnectRedisDB = async () => {
  return await redisClient
    .connect()
    .then(() => {
      console.log(`connect RadisDB.............`);
    })
    .catch((error) => console.log(`fail to connect RedisDB : ${error}`));
};
