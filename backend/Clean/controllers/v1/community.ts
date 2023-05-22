import CommunityService from "@services/v1/community";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "@services/v1/authentication";

class CommunityController {
  static async createCommunity(req: AuthenticatedRequest, res: Response) {
    const { name } = req.body;
    const { id } = req.user;
    const result = await CommunityService.createCommunity(name, id);
    if (!result.status) {
      return res.status(400).json(result);
    }
    return res.status(201).json(result);
  }

  static async getAllCommunities(req: Request, res: Response) {
    const result = await CommunityService.getAllCommunities(null);
    if (!result.status) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  }

  static async getAllCommunityMembers(req: Request, res: Response) {
    const slug = req.params.id;
    const result = await CommunityService.getAllCommunityMembers(slug, null);
    if (!result.status) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  }

  static async getMyOwnedCommunities(req: AuthenticatedRequest, res: Response) {
    const { id } = req.user;
    const result = await CommunityService.getMyOwnedCommunities(id, null);
    if (!result.status) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  }

  static async getMyJoinedCommunities(
    req: AuthenticatedRequest,
    res: Response
  ) {
    const { id } = req.user;
    const result = await CommunityService.getMyJoinedCommunities(id, null);
    if (!result.status) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  }
}

export default CommunityController;
