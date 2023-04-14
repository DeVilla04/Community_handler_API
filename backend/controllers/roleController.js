import Role from "../models/role.js";
import validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";

const createRole = async (req, res) => {
  const { name } = req.body;
  const rules = {
    name: "required|string|min:2",
  };
  const validation = new validator(req.body, rules);
  if (validation.fails()) {
    return res.status(400).json(validation.errors);
  }
  const { id } = req.user;
  try {
    const roleDetails = {
      id: Snowflake.generate(),
      name: name,
    };
    const role = await Role.create(roleDetails);
    return res.status(201).json({
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
      if (role.name == "Community Admin") {
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get", "member-add", "member-remove"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
      }
      if (role.name == "Community Member") {
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
      }
      if (role.name == "Community Moderator") {
        return {
          id: role.id,
          name: role.name,
          scopes: ["member-get", "member-remove"],
          createdAt: role.createdAt,
          updatedAt: role.updatedAt,
        };
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
        data: rows,
      },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export { createRole, getAllRoles };
