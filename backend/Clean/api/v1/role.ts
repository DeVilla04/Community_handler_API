import { Router } from "express";
import RoleController from "@controllers/v1/role";

const router: Router = Router();

// Define the routes for the role
router.post("/", RoleController.createRole); // POST /v1/role
router.get("/", RoleController.getAllRoles); // GET /v1/role

export default router;
