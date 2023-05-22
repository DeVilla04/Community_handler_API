import Validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import Database from "@loaders/v1/database";
import { Community, Member, Role, User } from "@prisma/client";
class MemberService {
  static async addMember(
    ownerID: string,
    community: string,
    user: string,
    role: string
  ) {
    // Validate the input
    const communityValidation = new Validator(
      { community },
      {
        community: "required|string",
      }
    );
    const userValidation = new Validator(
      { user },
      {
        user: "required|string",
      }
    );
    const roleValidation = new Validator(
      { role },
      {
        role: "required|string",
      }
    );
    if (communityValidation.fails()) {
      return {
        status: false,
        errors: [
          {
            param: "community",
            message: "Community id is required.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }
    if (userValidation.fails()) {
      return {
        status: false,
        errors: [
          {
            param: "user",
            message: "user id is required.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }
    if (roleValidation.fails()) {
      return {
        status: false,
        errors: [
          {
            param: "role",
            message: "Role id is required.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }
    // Check if the community exists
    const communityExists: Community | null =
      await Database.instance.community.findUnique({
        where: { id: community },
      });
    if (!communityExists) {
      return {
        status: false,
        errors: [
          {
            param: "community",
            message: "Community not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      };
    }

    // Check if the member exists
    const memberExists: User | null = await Database.instance.user.findUnique({
      where: { id: user },
    });
    if (!memberExists) {
      return {
        status: false,
        errors: [
          {
            param: "user",
            message: "User not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      };
    }

    // Check if the role exists
    const roleExists: Role | null = await Database.instance.role.findUnique({
      where: { id: role },
    });
    if (!roleExists) {
      return {
        status: false,
        errors: [
          {
            param: "role",
            message: "Role not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      };
    }

    // Check if the user is the owner of the community
    if (communityExists.owner !== ownerID) {
      return {
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      };
    }

    // Check if the user is already a member of the community
    const memberAlreadyExists: Member | null =
      await Database.instance.member.findFirst({
        where: {
          user: user,
          community: community,
        },
      });
    if (memberAlreadyExists) {
      return {
        status: false,
        errors: [
          {
            message: "User is already added in the community.",
            code: "RESOURCE_EXISTS",
          },
        ],
      };
    }

    // Create a new member
    try {
      const savedMember: Member = await Database.instance.member.create({
        data: {
          id: Snowflake.generate(),
          community: community,
          user: user,
          role: role,
        },
      });
      return {
        status: true,
        savedMember,
      };
    } catch (error: any) {
      return {
        status: false,
        errors: [
          {
            message: "Something went wrong.",
            code: "INTERNAL_SERVER_ERROR",
          },
          {
            message: error.message,
          },
        ],
      };
    }
  }

  static async removeMember(ownerID: string, memberId: string) {
    // Validate the input
    const memberValidation = new Validator(
      { memberId },
      {
        memberId: "required|string",
      }
    );
    if (memberValidation.fails()) {
      return {
        status: false,
        errors: [
          {
            param: "member",
            message: "Member id is required.",
            code: "INVALID_INPUT",
          },
        ],
      };
    }

    // Check if the member is actually member of some community
    const memberExists = await Database.instance.member.findMany({
      where: { id: memberId },
      include: {
        communityId: true,
      },
    });
    if (memberExists.length === 0) {
      return {
        status: false,
        errors: [
          {
            param: "member",
            message: "Member not found.",
            code: "RESOURCE_NOT_FOUND",
          },
        ],
      };
    }
    let foundCommunityID: string | null = null;
    memberExists.forEach((member) => {
      if (member.communityId.owner === ownerID) {
        foundCommunityID = member.community;
      }
    });

    if (!foundCommunityID) {
      return {
        status: false,
        errors: [
          {
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS",
          },
        ],
      };
    }

    // Delete the member
    try {
      const deletedMember = await Database.instance.member.delete({
        where: { id: memberId },
      });
      return {
        status: true,
      };
    } catch (error: any) {
      return {
        status: false,
        errors: [
          {
            message: "Something went wrong.",
            code: "INTERNAL_SERVER_ERROR",
          },
          {
            message: error.message,
          },
        ],
      };
    }
  }
}

export default MemberService;
