import { PrismaClient } from "@prisma/client";
import { cli } from "winston/lib/winston/config";

class Database {
  static instance: PrismaClient;

  static async Loader() {
    try {
      const client = new PrismaClient();
      console.log("Connecting to database...");
      await client.$connect();
      console.log("Connected to database.");
      Database.instance = client;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Database;
