import RoleService from "@services/v1/role";
import { Request, Response } from "express";

class RoleController {
  static async createRole(req: Request, res: Response) {
    const { name } = req.body;
    const result = await RoleService.createRoles(name);
    if (result.status) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  }

  static async getAllRoles(req: Request, res: Response) {
    const result = await RoleService.getAllRoles(null);
    if (result.status) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  }
}

export default RoleController;
