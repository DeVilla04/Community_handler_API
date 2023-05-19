import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const SECRET_KEY: string = process.env.JWT_SECRET_KEY!;
const EXPIRES_IN: string = process.env.JWT_EXPIRES_IN!;

const generateToken = (payload: Object): string => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
};

interface AuthenticatedRequest extends Request {
  user?: any;
}
const authentication = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token: string = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      status: false,
      errors: [
        {
          param: "token",
          message: "No token provided.",
          code: "INVALID_TOKEN",
        },
      ],
    });
  }
  try {
    const decoded: string | jwt.JwtPayload = jwt.verify(token, SECRET_KEY);

    if (typeof decoded !== "string" && decoded.exp! < Date.now() / 1000) {
      return res.status(401).json({
        status: false,
        errors: [
          {
            param: "token",
            message: "Token expired. Sign In again.",
            code: "INVALID_TOKEN",
          },
        ],
      });
    }

    req.user = decoded;
    next();
  } catch (error: any) {
    return res.status(401).json({
      status: false,
      errors: [
        {
          param: "token",
          message: "Invalid token.",
          code: "INVALID_TOKEN",
        },
        {
          error: error,
        },
      ],
    });
  }
};

export { generateToken, authentication, AuthenticatedRequest };
