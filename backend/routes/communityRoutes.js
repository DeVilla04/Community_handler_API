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

// Define the routes for the community
router.post("/v1/community", authentication, createCommunity); // POST /v1/community
router.get("/v1/community", getAllCommunities); // GET /v1/community
router.get("/v1/community/:id/members", getAllCommunityMembers); // GET /v1/community/:id/members
router.get("/v1/community/me/owner", authentication, getMyOwnedCommunities); // GET /v1/community/me/owner/
router.get("/v1/community/me/member", authentication, getMyJoinedCommunities); // GET /v1/community/me/member/

export default router;
