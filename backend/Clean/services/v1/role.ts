import Validator from "validatorjs";
import Database from "@loaders/v1/database";
import { Snowflake } from "@theinternetfolks/snowflake";
import { Role } from "@prisma/client";

interface RoleScope {
  id: string;
  name: string;
  scopes: string[];
  createdAt: Date;
  updatedAt: Date;
}

class RoleService {
  // Create a new role
  static async createRoles(name: string) {
    // Validate the input
    const nameValidation = new Validator(
      { name: name },
      {
        name: "required|string|min:2",
      }
    );
    if (nameValidation.fails()) {
      return {
        status: false,
        errors: [
          {
            param: "name",
            message: "Name should be at least 2 characters.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }

    // Create the role
    try {
      const savedRole = await Database.instance.role.create({
        data: {
          id: Snowflake.generate(),
          name: name,
        },
      });
      return {
        status: true,
        content: {
          data: savedRole,
        },
      };
    } catch (error: any) {
      return {
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
      };
    }
  }

  // Get all roles
  static async getAllRoles(page: number | null) {
    try {
      let allRoles = await Database.instance.role.findMany();
      const roles: (Role | RoleScope)[] = allRoles.map((role) => {
        if (role.name == "Community Admin") {
          return {
            id: role.id,
            name: role.name,
            scopes: ["member-get", "member-add", "member-remove"],
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
          } as RoleScope;
        }
        if (role.name == "Community Member") {
          return {
            id: role.id,
            name: role.name,
            scopes: ["member-get"],
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
          } as RoleScope;
        }
        if (role.name == "Community Moderator") {
          return {
            id: role.id,
            name: role.name,
            scopes: ["member-get", "member-remove"],
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
          } as RoleScope;
        }
        return role;
      });

      return {
        status: true,
        meta: {
          total: allRoles.length,
          pages: Math.ceil(allRoles.length / 10),
          page: page || 1,
        },
        Content: {
          data: roles,
        },
      };
    } catch (error: any) {
      return { message: error.message };
    }
  }
}

export default RoleService;
