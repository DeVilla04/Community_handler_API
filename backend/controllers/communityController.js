import validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import { Op } from "sequelize";
import Community from "../models/community.js";
import User from "../models/user.js";
import Role from "../models/role.js";
import { Member } from "../models/member.js";

const createCommunity = async (req, res) => {
  // implement logic to create a community
  const { name } = req.body;
  const rules = {
    name: "required|string|min:2",
  };
  const validation = new validator(req.body, rules);
  if (validation.fails()) {
    return res.status(400).json(validation.errors);
  }
  const id = Snowflake.generate();
  const owner = req.user.id;

  // Create slug from name
  const slug = name.toLowerCase().replace(/ /g, "-");

  const communityExists = await Community.findOne({ where: { slug } });
  if (communityExists) {
    res.send("Community already exists");
  } else {
    try {
      const community = await Community.create({
        id: id,
        name: name,
        slug: slug,
        owner: owner,
      });
      const role = await Role.create({
        id: Snowflake.generate(),
        name: "Community Admin",
      });
      const member = await Member.create({
        id: Snowflake.generate(),
        community: id,
        user: owner,
        role: role.id,
      });
      res.status(201).json({ status: "true", content: { data: community } });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
};

const getAllCommunities = async (req, res) => {
  // implement logic to retrieve all communities
  try {
    // Details of the owner should be expanded to know the name of the owner
    let { count, rows } = await Community.findAndCountAll({
      include: [
        {
          model: User,
          as: "communityOwner",
          attributes: ["id", "name"],
        },
      ],
    });
    console.log(rows);
    rows = rows.map((row) => {
      return {
        id: row.id,
        name: row.name,
        slug: row.slug,
        owner: row.communityOwner,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    });
    const pages = Math.ceil(count / 10);
    const page = req.query.page || 1;
    res.status(200).json({
      status: "true",
      content: {
        meta: { total: count, pages: pages, page: page },
        data: rows,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const getAllCommunityMembers = async (req, res) => {
  // implement logic to retrieve all members of a community
  const { id } = req.params;
  try {
    // Details of the member should be expanded to know the name of the member and roles should be expanded to know the name of the role of the member
    const communityID = await Community.findOne({ where: { slug: id } });
    console.log(communityID.id);
    let { count, rows } = await Member.findAndCountAll({
      where: { community: communityID.id },
      include: [
        {
          model: User,
          as: "userMembers",
          attributes: ["id", "name"],
        },
        {
          model: Role,
          as: "roleMembers",
          attributes: ["id", "name"],
        },
      ],
    });
    rows = rows.map((row) => {
      return {
        id: row.id,
        community: row.community,
        user: row.userMembers,
        role: row.roleMembers,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      };
    });
    const pages = Math.ceil(count / 10);
    const page = req.query.page || 1;
    res.status(200).json({
      status: "true",
      content: {
        meta: { total: count, pages: pages, page: page },
        data: rows,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOwnedCommunities = async (req, res) => {
  // implement logic to retrieve all owned communities by user id
  const { id } = req.user;
  try {
    const { count, rows } = await Community.findAndCountAll({
      where: { owner: id },
    });
    const pages = Math.ceil(count / 10);
    const page = req.query.page || 1;
    res.status(200).json({
      status: "true",
      content: {
        meta: { total: count, pages: pages, page: page },
        data: rows,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyJoinedCommunities = async (req, res) => {
  // implement logic to retrieve all joined communities by user id
  // SELECT community FROM member where user = id AS multiple
  // SELECT * FROM communities WHERE id IN multiple AND owner != id
  const { id } = req.user;
  try {
    // SELECT * FROM communities WHERE id IN (SELECT community FROM member WHERE user = 'user_id') AND owner != 'user_id';
    const { count, rows } = await Community.findAndCountAll({
      where: {
        id: {
          [Op.in]: Member.findAll({
            attributes: ["community"],
            where: {
              user: id,
            },
          }),
        },
        owner: {
          [Op.ne]: id,
        },
      },
    });
    const pages = Math.ceil(count / 10);
    const page = req.query.page || 1;
    res.status(200).json({
      status: "true",
      content: {
        meta: { total: count, pages: pages, page: page },
        data: rows,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export {
  createCommunity,
  getAllCommunities,
  getAllCommunityMembers,
  getMyOwnedCommunities,
  getMyJoinedCommunities,
};
