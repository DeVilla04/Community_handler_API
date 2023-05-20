import UserService from "@services/v1/user";
import express from "express";
import { AuthenticatedRequest } from "@services/v1/authentication";

class UserController {
  static async signUp(req: express.Request, res: express.Response) {
    const { name, email, password } = req.body;
    const result = await UserService.signUp(name, email, password);
    if (result.status && result.newUser) {
      res.status(201).json({
        status: true,
        content: {
          data: {
            id: result.newUser.id,
            name: result.newUser.name,
            email: result.newUser.email,
          },
        },
        meta: {
          access_token: result.token,
        },
      });
    } else {
      res.status(400).json(result);
    }
  }

  static async signIn(req: express.Request, res: express.Response) {
    const { email, password } = req.body;
    const result = await UserService.signIn(email, password);
    if (result.status && result.meta) {
      res.status(200).cookie("token", result.meta.access_token).json(result);
    } else {
      res.status(400).json(result);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: express.Response) {
    const decoded = req.user; // get the user from the request object (set by the authentication middleware)
    const result = await UserService.getMe(decoded.id);
    if (result.status) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  }
}

export default UserController;
