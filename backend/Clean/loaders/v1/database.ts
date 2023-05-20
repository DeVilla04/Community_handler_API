import { Sequelize } from "sequelize-typescript";
import Env from "./env";
import Community from "@models/v1/community";
import User from "@models/v1/user";
import Member from "@models/v1/member";
import Role from "@models/v1/role";

class Database {
  static instance: Sequelize;

  static client: Sequelize;

  static async Loader() {
    const sequelize = new Sequelize({
      database: Env.variable.DB_NAME,
      dialect: "mysql",
      username: Env.variable.DB_USERNAME,
      password: Env.variable.DB_PASSWORD,
      host: Env.variable.DB_HOST,
      models: [Community, User, Member, Role],
    });

    try {
      sequelize.sync();
      await sequelize.authenticate();
      console.log("Connection has been established successfully");
    } catch (error: any) {
      console.error(error + "Connection Rejected.");
    }
  }
}

export default Database;
