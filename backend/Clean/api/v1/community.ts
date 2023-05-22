import { Router } from "express";
import CommunityControllers from "@controllers/v1/community";
import { authentication } from "@services/v1/authentication";

const router: Router = Router();

// Define the routes for the community
router.post("/", authentication, CommunityControllers.createCommunity); // POST /v1/community
router.get("/", CommunityControllers.getAllCommunities); // GET /v1/community
router.get("/:id/members", CommunityControllers.getAllCommunityMembers); // GET /v1/community/:id/members
router.get(
  "/me/owner",
  authentication,
  CommunityControllers.getMyOwnedCommunities
); // GET /v1/community/me/owner/
router.get(
  "/me/member",
  authentication,
  CommunityControllers.getMyJoinedCommunities
); // GET /v1/community/me/member/

export default router;
