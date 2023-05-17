import { Router } from "express";
import { signUp, signIn, getMe } from "../controllers/userController.js";
import { authentication } from "../middleware/authentication.js";

const router = Router();

// Define the routes for the user
router.post("/v1/auth/signup", signUp); // POST /v1/auth/signup
router.post("/v1/auth/signin", signIn); // POST /v1/auth/signin
router.get("/v1/auth/me", authentication, getMe); // GET /v1/auth/me

export default router;
