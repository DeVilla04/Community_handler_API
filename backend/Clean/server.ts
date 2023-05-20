import express from "express";
import Env from "@loaders/v1/env";
import frameworkLoader from "@loaders/v1/framework";
import Database from "@loaders/v1/database";
import userRoutes from "@api/v1/user";
import communityRoutes from "@api/v1/community";
import memberRoutes from "@api/v1/member";
import roleRoutes from "@api/v1/role";

const server = async (): Promise<express.Application> => {
  const app = express();

  //Loaders
  Env.Loader();
  frameworkLoader(app);
  await Database.Loader();

  //Middlewares

  //Routes
  app.use("/v1/auth", userRoutes);
  app.use("/v1/community", communityRoutes);
  app.use("/v1/member", memberRoutes);
  app.use("/v1/role", roleRoutes);

  return app;
};

export default server;
