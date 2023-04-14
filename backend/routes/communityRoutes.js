import { Router } from "express";
import {
  createCommunity,
  getAllCommunities,
  getAllCommunityMembers,
  getMyOwnedCommunities,
  getMyJoinedCommunities,
} from "../controllers/communityController.js";
import { authentication } from "../middleware/authentication.js";

const router = Router();

router.post("/v1/community", authentication, createCommunity);
router.get("/v1/community", getAllCommunities);
router.get("/v1/community/:id/members", getAllCommunityMembers);
router.get("/v1/community/me/owner", authentication, getMyOwnedCommunities);
router.get("/v1/community/me/member", authentication, getMyJoinedCommunities);

export default router;
