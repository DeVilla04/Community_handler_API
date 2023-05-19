import { Request, Response, RequestHandler } from "express";
import Validator from "validatorjs";
import Role from "../models/role";
import { Snowflake } from "@theinternetfolks/snowflake";
// Create a new role
const createRole: RequestHandler = async (req: Request, res: Response) => {
  // Get the role name from the request
  const { name } = req.body;

  // Validate the input
  const nameValidation = new Validator(
    { name: name },
    {
      name: "required|string|min:2",
    }
  );
  if (nameValidation.fails()) {
    return res.status(400).json({
      status: false,
      errors: [
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
      ],
    });
  }

  // Create the role
  try {
    const savedRole = await Role.create({
      id: Snowflake.generate(),
      name: name,
    });
    return res.status(201).json({
      status: true,
      content: {
        data: savedRole,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: false,
      errors: [
        {
          message: "Server error.",
          code: "SERVER_ERROR",
        },
        {
          error: error.message,
        },
      ],
    });
  }
};

interface Rows {
  id: string;
  name: string;
  scopes: string[];
  createdAt: Date;
  updatedAt: Date;
}
// Get all roles
const getAllRoles = async (req: Request, res: Response) => {
  try {
    let { count, rows } = await Role.findAndCountAll();
    const roles: (Role | Rows)[] = rows.map((role) => {
      if (role.name == "Community Admin") {
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get", "member-add", "member-remove"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        } as Rows;
      }
      if (role.name == "Community Member") {
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        } as Rows;
      }
      if (role.name == "Community Moderator") {
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get", "member-remove"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        } as Rows;
      }
      return role;
    });
    return res.status(200).json({
      status: true,
      meta: {
        total: count,
        pages: Math.ceil(count / 10),
        page: req.query.page || 1,
      },
      Content: {
        data: roles,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};
export { createRole, getAllRoles };
