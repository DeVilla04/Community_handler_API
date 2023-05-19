import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import Community from "./models/community";
import User from "./models/user";
import Member from "./models/member";
import Role from "./models/role";

dotenv.config();

const DB_NAME: string = process.env.DB_NAME!;
const DB_USER: string = process.env.DB_USER!;
const DB_PASSWORD: string = process.env.DB_PASSWORD!;
const DB_HOST: string = process.env.DB_HOST!;

const sequelize = new Sequelize({
  database: DB_NAME,
  dialect: "mysql",
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  models: [Community, User, Member, Role],
});

export default sequelize;
