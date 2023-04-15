import { Router } from "express";
import { createRole, getAllRoles } from "../controllers/roleController.js";
import { authentication } from "../middleware/authentication.js";

const router = Router();

// Define the routes for the role
router.post("/v1/role", createRole); // POST /v1/role
router.get("/v1/role", getAllRoles); // GET /v1/role

export default router;
