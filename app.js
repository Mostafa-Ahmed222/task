import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
//set directory dirname and setup .env file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "./config/.env") });

import express from "express";
import appRouter from "./src/modules/index.router.js";
const app = express();
// setup with Port
const port = process.env.PORT || 5000;
// convertBufferData, ApiRouting , Handeling error and connectDB with server...
appRouter(app);

// running server
app.listen(port, () => console.log(`running........... on port ${port}`));
