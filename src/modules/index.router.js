import express from "express";
import { connectDB, ConnectRedisDB } from "../../DB/connection.js";
import cors from "cors";
import morgan from "morgan";
// importing routing
import authRouter from "./auth/auth.router.js";
import clientRouter from "./client/client.router.js";
import productRouter from "./product/product.router.js";
import orderRouter from "./order/order.router.js";
import notificationRouter from "./notification/notification.router.js";
// importing ScheduleJob and global Handeling error
import { dailyReports, sendOffers } from "../services/scheduleJob.js";
import { globalError } from "../services/handelError.js";



const appRouter = (app) => {
  //convert Buffer Data
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  //cors
  app.use(cors());
  // setup morgans mode
  if (process.env.MOOD == "dev") {
    app.use(morgan("dev"));
  }

  // setup api routing
  app.use("/auth", authRouter);
  app.use("/client", clientRouter);
  app.use("/product", productRouter);
  app.use("/order", orderRouter);
  app.use("/notification", notificationRouter);
  app.use("*", (req, res) => {
    res.status(404).send("<h1>404 page Not found</h1>");
  });

  // run scheduleJob
  sendOffers();
  dailyReports();

  // global Handeling error
  app.use(globalError);

  // connectDBs
  ConnectRedisDB();
  connectDB();
};

export default appRouter;
