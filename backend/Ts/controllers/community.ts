import Community from "../models/community";
import User from "../models/user";
import Member from "../models/member";
import Role from "../models/role";
import { Request, Response, RequestHandler } from "express";
import { AuthenticatedRequest } from "../middlewares/authentication";
import Validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import { Op } from "sequelize";

// Create a new community
const createCommunity: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // Get the user id from the request
  const userId = req.user.id;

  // Get the community name from the request
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

  try {
    const slug: string = name.toLowerCase().replace(/ /g, "-");
    const communityExists: Community | null = await Community.findOne({
      where: { slug: slug },
    });
    if (communityExists) {
      return res.status(400).json({
        status: false,
        errors: [
          {
            param: "slug",
            message: "Community already exists.",
            code: "INVALID_INPUT",
          },
        ],
      });
    }
    const createdCommunity = await Community.create({
      id: Snowflake.generate(),
      name: name,
      slug: slug,
      owner: userId,
    });

    const createdrole = await Role.create({
      id: Snowflake.generate(),
      name: "Community Admin",
    });
    const createdmember = await Member.create({
      id: Snowflake.generate(),
      community: createdCommunity.id,
      user: userId,
      role: createdrole.id,
    });
    return res.status(201).json({
      status: true,
      content: {
        data: createdCommunity,
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
          error: error,
        },
      ],
    });
  }
};

interface allCommunity {
  id: string;
  name: string;
  slug: string;
  owner: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
// Get all communities
const getAllCommunities: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const { count, rows } = await Community.findAndCountAll({
      include: [
        {
          model: User,
          as: "communityOwner",
          attributes: ["id", "name"],
        },
      ],
    });

    const allCommunities: allCommunity[] = rows.map((community) => {
      return {
        id: community.id,
        name: community.name,
        slug: community.slug,
        owner: {
          id: community.communityOwner.id,
          name: community.communityOwner.name,
        },
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
      };
    });

    return res.status(200).json({
      // return the communities
      status: "true",
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / 10),
          page: req.query.page || 1,
        },
        data: allCommunities,
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

// Get all members of a community
const getAllCommunityMembers: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const communityId = await Community.findOne({
      where: {
        slug: req.params.id,
      },
    });

    const { count, rows } = await Member.findAndCountAll({
      where: {
        community: communityId!.id,
      },
      include: [
        {
          model: User,
          as: "userObj",
          attributes: ["id", "name"],
        },
        {
          model: Role,
          as: "roleObj",
          attributes: ["id", "name"],
        },
      ],
    });

    const allMembers = rows.map((member) => {
      return {
        id: member.id,
        user: {
          id: member.userObj.id,
          name: member.userObj.name,
        },
        role: {
          id: member.roleObj.id,
          name: member.roleObj.name,
        },
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      };
    });

    return res.status(200).json({
      // return the communities
      status: "true",
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / 10),
          page: req.query.page || 1,
        },
        data: allMembers,
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

// Get all communities owned by the user
const getMyOwnedCommunities: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // Get the user id from the request
  const userId: string = req.user.id;

  try {
    const { count, rows } = await Community.findAndCountAll({
      where: {
        owner: userId,
      },
    });

    return res.status(200).json({
      // return the communities
      status: "true",
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / 10),
          page: req.query.page || 1,
        },
        data: rows,
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

// Get all communities joined by the user
const getMyJoinedCommunities: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  // Get the user id from the request

  const userId = req.user.id;
  console.log(userId);
  try {
    // SELECT * FROM communities WHERE id IN (SELECT community FROM member WHERE user = 'user_id') AND owner != 'user_id';
    const communities = await Member.findAll({
      where: {
        user: userId,
      },
      attributes: ["community"],
    });

    const { count, rows } = await Community.findAndCountAll({
      where: {
        id: {
          [Op.in]: communities.map((community) => community.community),
        },
        owner: {
          [Op.ne]: userId,
        },
      },
      include: [
        {
          model: User,
          as: "communityOwner",
          attributes: ["id", "name"],
        },
      ],
    });

    const allCommunities: allCommunity[] = rows.map((community) => {
      return {
        id: community.id,
        name: community.name,
        slug: community.slug,
        owner: {
          id: community.communityOwner.id,
          name: community.communityOwner.name,
        },
        createdAt: community.createdAt,
        updatedAt: community.updatedAt,
      };
    });

    return res.status(200).json({
      // return the communities
      status: "true",
      content: {
        meta: {
          total: count,
          pages: Math.ceil(count / 10),
          page: req.query.page || 1,
        },
        data: allCommunities,
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

export {
  createCommunity,
  getAllCommunities,
  getAllCommunityMembers,
  getMyOwnedCommunities,
  getMyJoinedCommunities,
};
