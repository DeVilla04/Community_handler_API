import { Router } from "express";
import { createRole, getAllRoles } from "../controllers/role";

const router: Router = Router();

// Define the routes for the role
router.post("/", createRole); // POST /v1/role
router.get("/", getAllRoles); // GET /v1/role

export default router;
