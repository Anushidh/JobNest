import express from "express";
import dotenv from "dotenv";
import { InversifyExpressServer } from "inversify-express-utils";
import cookieParser from "cookie-parser";

import { container } from "./container";
import connectToDB from "../config/db.config";
import globalErrorHandler from "../middlewares/error.middleware";
import corsConfig from "../config/cors.config";
import "../controllers/employer.controller";
import "../controllers/job.controller";
import "../controllers/applicant.controller";
import "../controllers/plan.controller";
// import "../controllers/payment.controller";

export class App {
  async setup() {
    console.clear();
    dotenv.config();

    connectToDB();
    const PORT = process.env.PORT || 5000;
    const server = new InversifyExpressServer(container, null, {
      rootPath: "/api",
    });

    server.setConfig((app) => {
      app.use(corsConfig);
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(cookieParser());
    });

    server.setErrorConfig((app) => {
      app.use(globalErrorHandler);
    });

    let app = server.build();

    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  }
}
