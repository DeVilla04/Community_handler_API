import { Router } from "express";
import { addMember, removeMember } from "../controllers/memberController.js";
import { authentication } from "../middleware/authentication.js";

const router = Router();

// Define the routes for the member
router.post("/v1/member", authentication, addMember); // POST /v1/member
router.delete("/v1/member/:id", authentication, removeMember); // DELETE /v1/member/:id

export default router;
