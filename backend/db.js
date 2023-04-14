import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Create a new Sequelize instance use pass in the database name, username and password
const sequelize = new Sequelize(
  process.env.DB_NAME || "communityHandle",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
  }
);

export default sequelize;
