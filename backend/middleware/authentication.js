import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
// Middleware to check if the user is authenticated using cookies
const authentication = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Please sign in" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
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
