import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Middleware to check if the user is authenticated using cookies
const authentication = (req, res, next) => {
  // req, res and next are parameters passed to the middleware function
  const token = req.cookies.token; // get the token from the cookies
  if (!token) {
    // if token is not found
    return res.status(401).json({ message: "Unauthorized - Please sign in" }); // return error
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // verify the token
    req.user = decoded; // set the user in the request object
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized - Invalid token" });
  }
};

// Middleware to generate token
const generateToken = (user) => {
  //   console.log(user);
  const token = jwt.sign(user.dataValues, process.env.JWT_SECRET);
  return token;
};

export { authentication, generateToken };
