import Role from "../models/role.js";
import validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";

const createRole = async (req, res) => {
  const { name } = req.body; // name of the role to be created
  const rules = {
    name: "required|string|min:2", // name is required and must be a string
  };
  const validation = new validator(req.body, rules); // validate the input
  if (validation.fails()) {
    return res.status(400).json(validation.errors);
  }
  // const { id } = req.user;
  try {
    const roleDetails = {
      // create a new role
      id: Snowflake.generate(),
      name: name,
    };
    const role = await Role.create(roleDetails); // create the role
    return res.status(201).json({
      // return the created roles
      status: true,
      Content: {
        data: role,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAllRoles = async (req, res) => {
  try {
    let { count, rows } = await Role.findAndCountAll();
    rows = rows.map((role) => {
      // map through the roles
      if (role.name == "Community Admin") {
        // if the role is a community admin, return the role with the scopes
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get", "member-add", "member-remove"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
      }
      if (role.name == "Community Member") {
        // if the role is a community member, return the role with the scopes
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
      }
      if (role.name == "Community Moderator") {
        // if the role is a community moderator, return the role with the scopes
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get", "member-remove"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
      }
      return role; // return the role
    });
    return res.status(200).json({
      // return the roles
      status: true,
      meta: {
        total: count,
        pages: Math.ceil(count / 10),
        page: req.query.page || 1,
      },
      Content: {
        data: rows,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export { createRole, getAllRoles };
