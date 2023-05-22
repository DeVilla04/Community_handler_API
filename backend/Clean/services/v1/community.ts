import Validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import Database from "@loaders/v1/database";

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
      const communityExists = await Database.instance.community.findUnique({
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
      const createdCommunity = await Database.instance.community.create({
        data: {
          id: Snowflake.generate(),
          name: name,
          slug: slug,
          owner: owner,
        },
      });

      const createdrole = await Database.instance.role.create({
        data: {
          id: Snowflake.generate(),
          name: "Community Admin",
        },
      });
      const createdmember = await Database.instance.member.create({
        data: {
          id: Snowflake.generate(),
          community: createdCommunity.id,
          user: owner,
          role: createdrole.id,
        },
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

  static async getAllCommunities(page: number | null) {
    try {
      const communities = await Database.instance.community.findMany({
        include: {
          ownerID: true,
        },
      });

      const allCommunities: allCommunity[] = communities.map((community) => {
        return {
          id: community.id,
          name: community.name,
          slug: community.slug,
          owner: {
            id: community.ownerID.id,
            name: community.ownerID.name,
          },
          createdAt: community.CreatedAt,
          updatedAt: community.UpdatedAt,
        };
      });

      return {
        // return the communities
        status: "true",
        content: {
          meta: {
            total: communities.length,
            pages: Math.ceil(communities.length / 10),
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
      const communityId = await Database.instance.community.findUnique({
        where: {
          slug: communitySlug,
        },
      });

      const members = await Database.instance.member.findMany({
        where: {
          community: communityId!.id,
        },
        include: {
          userId: true,
          roleId: true,
        },
      });

      const allMembers = members.map((member) => {
        return {
          id: member.id,
          user: {
            id: member.userId.id,
            name: member.userId.name,
          },
          role: {
            id: member.roleId.id,
            name: member.roleId.name,
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
            total: members.length,
            pages: Math.ceil(members.length / 10),
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

  static async getMyOwnedCommunities(userId: string, page: number | null) {
    try {
      const communities = await Database.instance.community.findMany({
        where: {
          owner: userId,
        },
        include: {
          ownerID: true,
        },
      });

      const allCommunities: allCommunity[] = communities.map((community) => {
        return {
          id: community.id,
          name: community.name,
          slug: community.slug,
          owner: {
            id: community.ownerID.id,
            name: community.ownerID.name,
          },
          createdAt: community.CreatedAt,
          updatedAt: community.UpdatedAt,
        };
      });

      return {
        // return the communities
        status: "true",
        content: {
          meta: {
            total: communities.length,
            pages: Math.ceil(communities.length / 10),
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

  static async getMyJoinedCommunities(userId: string, page: number | null) {
    try {
      const communities = await Database.instance.member.findMany({
        include: {
          communityId: true,
        },
        where: {
          user: userId,
        },
      });

      communities.map((community) => {
        if (community.communityId.owner !== userId) {
          return {
            id: community.communityId.id,
            name: community.communityId.name,
            slug: community.communityId.slug,
            owner: {
              id: community.communityId.owner,
            },
            createdAt: community.communityId.CreatedAt,
            updatedAt: community.communityId.UpdatedAt,
          };
        }
      }) as allCommunity[];

      return {
        // return the communities
        status: "true",
        content: {
          meta: {
            total: communities.length,
            pages: Math.ceil(communities.length / 10),
            page: page || 1,
          },
          data: communities,
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
}

export default CommunityService;
