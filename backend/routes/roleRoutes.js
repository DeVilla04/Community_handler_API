import { Router } from "express";
import { createRole, getAllRoles } from "../controllers/roleController.js";
import { authentication } from "../middleware/authentication.js";

const router = Router();

router.post("/v1/role", authentication, createRole);
router.get("/v1/role", getAllRoles);

export default router;
