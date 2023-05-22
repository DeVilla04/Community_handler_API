import Community from "@models/v1/community";
import Role from "@models/v1/role";
import User from "@models/v1/user";
import Member from "@models/v1/member";
import Validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";

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

class CommunityService {
  static async createCommunity(name: string, owner: string) {
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

    try {
      const slug: string = name.toLowerCase().replace(/ /g, "-");
      const communityExists: Community | null = await Community.findOne({
        where: { slug: slug },
      });
      if (communityExists) {
        return {
          status: false,
          errors: [
            {
              param: "slug",
              message: "Community already exists.",
              code: "INVALID_INPUT",
            },
          ],
        };
      }
      const createdCommunity = await Community.create({
        id: Snowflake.generate(),
        name: name,
        slug: slug,
        owner: owner,
      });

      const createdrole = await Role.create({
        id: Snowflake.generate(),
        name: "Community Admin",
      });
      const createdmember = await Member.create({
        id: Snowflake.generate(),
        community: createdCommunity.id,
        user: owner,
        role: createdrole.id,
      });

      return {
        status: true,
        content: {
          data: createdCommunity,
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

  static async getAllCommunity(page: number | null) {
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

      return {
        // return the communities
        status: "true",
        content: {
          meta: {
            total: count,
            pages: Math.ceil(count / 10),
            page: page || 1,
          },
          data: allCommunities,
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

  static async getAllCommunityMembers(
    communitySlug: string,
    page: number | null
  ) {
    try {
      const communityId = await Community.findOne({
        where: {
          slug: communitySlug,
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

      return {
        // return the communities
        status: "true",
        content: {
          meta: {
            total: count,
            pages: Math.ceil(count / 10),
            page: page || 1,
          },
          data: allMembers,
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

  static async getMyOwnedCommunities(userId: string, page: number | null) {}
}

export default CommunityService;
