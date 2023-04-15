import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Create a new Sequelize instance use pass in the database name, username and password
const sequelize = new Sequelize(
  process.env.DB_NAME || "communityHandle", // database name
  process.env.DB_USER || "root", // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST || "localhost", // database host
    dialect: "mysql", // the dialect of the database
  }
);

export default sequelize;
