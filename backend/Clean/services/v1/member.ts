import Validator from "validatorjs";
import { Snowflake } from "@theinternetfolks/snowflake";
import Community from "@models/v1/community";
import Member from "@models/v1/member";
import Role from "@models/v1/role";
import User from "@models/v1/user";

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
    const communityExists: Community | null = await Community.findOne({
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
    const memberExists: User | null = await User.findOne({
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
    const roleExists: Role | null = await Role.findOne({
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
    const memberAlreadyExists: Member | null = await Member.findOne({
      where: { community: community, user: user },
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
      const savedMember: Member = await Member.create({
        id: Snowflake.generate(),
        community: community,
        user: user,
        role: role,
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
    const { rows, count } = await Member.findAndCountAll({
      where: { id: memberId },
      include: [
        {
          model: Community,
          as: "communityObj",
          attributes: ["id", "owner"],
        },
      ],
    });
    if (count === 0) {
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
    rows.forEach((member) => {
      if (member.communityObj.owner === ownerID) {
        foundCommunityID = member.communityObj.id;
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
      const deletedMember: number = await Member.destroy({
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
