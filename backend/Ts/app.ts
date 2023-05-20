import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import sequelize from "./db";
import userRoutes from "./routes/user";
import communityRoutes from "./routes/community";
import memberRoutes from "./routes/member";
import roleRoutes from "./routes/role";

// import defineAssociations from "./models/relationship";

// Create a new express application instance
const app: express.Application = express();

// Middleware to parse the body of the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse the cookies of the request
app.use(cookieParser());

// Middleware to enable CORS
const corsOptions: cors.CorsOptions = {
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

// Define the associations
// defineAssociations();
sequelize.sync();
// Db connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err: Error) => {
    console.error("Unable to connect to the database:", err);
  });

// Routes
app.use("/v1/auth", userRoutes);
app.use("/v1/community", communityRoutes);
app.use("/v1/member", memberRoutes);
app.use("/v1/role", roleRoutes);

// Port to listen on
const port = 4444;
app.listen(port, () => {
  console.log(`server running at on ${port}`);
  console.log(`App is running on http://localhost:${port}`);
});
