import { Router } from "express";
import MemberController from "@controllers/v1/member";
import { authentication } from "@services/v1/authentication";

const router: Router = Router();

// Define the routes for the member
router.post("/", authentication, MemberController.addMember); // POST /v1/member
router.delete("/:id", authentication, MemberController.removeMember); // DELETE /v1/member/:id

export default router;
