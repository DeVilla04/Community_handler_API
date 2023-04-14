import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import sequelize from "./db.js";
import communityRoutes from "./routes/communityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import { defineAssociations } from "./models/member.js";
// Create a new express application instance
const app = express();

// Enable CORS
const corsOptions = {
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// middleware to parse the request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// middleware to parse the cookies
app.use(cookieParser());

// create the database tables
defineAssociations();
sequelize.sync();

// Test the database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Unable to connect to database:", error);
  });

// Define the routes
app.use("/", communityRoutes);
app.use("/", userRoutes);
app.use("/", roleRoutes);
app.use("/", memberRoutes);

// Start the server
const PORT = 4444;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
