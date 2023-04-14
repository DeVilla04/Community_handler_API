import { Router } from "express";
import { signUp, signIn, getMe } from "../controllers/userController.js";
import { authentication } from "../middleware/authentication.js";

const router = Router();

router.post("/v1/auth/signup", signUp);
router.post("/v1/auth/signin", signIn);
router.get("/v1/auth/me", authentication, getMe);

export default router;
