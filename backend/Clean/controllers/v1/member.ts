import MemberService from "@services/v1/member";
import { Response } from "express";
import { AuthenticatedRequest } from "@services/v1/authentication";

class MemberController {
  static async addMember(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user.id;
    const { communityId, userId, roleId } = req.body;
    const result = await MemberService.addMember(
      ownerId,
      communityId,
      userId,
      roleId
    );
    if (result.status && result.savedMember) {
      res.status(201).json({
        status: result.status,
        content: {
          data: {
            id: result.savedMember.id,
            communityId: result.savedMember.community,
            userId: result.savedMember.user,
            roleId: result.savedMember.role,
          },
        },
      });
    } else {
      res.status(400).json(result);
    }
  }

  static async removeMember(req: AuthenticatedRequest, res: Response) {
    const ownerId = req.user.id;
    const { id } = req.params;
    const result = await MemberService.removeMember(ownerId, id);
    if (result.status) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  }
}

export default MemberController;
