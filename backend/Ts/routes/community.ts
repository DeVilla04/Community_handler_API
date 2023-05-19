import { Router } from "express";
import {
  createCommunity,
  getAllCommunities,
  getAllCommunityMembers,
  getMyOwnedCommunities,
  getMyJoinedCommunities,
} from "../controllers/community";
import { authentication } from "../middlewares/authentication";

const router: Router = Router();

// Define the routes for the community
router.post("/", authentication, createCommunity); // POST /v1/community
router.get("/", getAllCommunities); // GET /v1/community
router.get("/:id/members", getAllCommunityMembers); // GET /v1/community/:id/members
router.get("/me/owner", authentication, getMyOwnedCommunities); // GET /v1/community/me/owner/
router.get("/me/member", authentication, getMyJoinedCommunities); // GET /v1/community/me/member/

export default router;
