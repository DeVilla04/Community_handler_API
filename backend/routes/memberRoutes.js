import { Router } from "express";
import { addMember, removeMember } from "../controllers/memberController.js";
import { authentication } from "../middleware/authentication.js";

const router = Router();

router.post("/v1/member", authentication, addMember);
router.delete("/v1/member/:id", authentication, removeMember);

export default router;
