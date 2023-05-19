import { Router } from "express";
import { addMember, removeMember } from "../controllers/member";
import { authentication } from "../middlewares/authentication";

const router: Router = Router();

// Define the routes for the member
router.post("/", authentication, addMember); // POST /v1/member
router.delete("/:id", authentication, removeMember); // DELETE /v1/member/:id

export default router;
