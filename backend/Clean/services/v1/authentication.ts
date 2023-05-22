import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import Env from "@loaders/v1/env";

// const SECRET_KEY: string = Env.variable.JWT_SECRET_KEY!;
// const EXPIRES_IN: string = Env.variable.JWT_EXPIRES_IN!;

const generateToken = (payload: Object): string => {
  return jwt.sign(payload, Env.variable.JWT_SECRET_KEY, {
    expiresIn: Env.variable.JWT_EXPIRES_IN,
  });
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
    const decoded: string | jwt.JwtPayload = jwt.verify(
      token,
      Env.variable.JWT_SECRET_KEY
    );

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

export type { AuthenticatedRequest };
export { generateToken, authentication };
