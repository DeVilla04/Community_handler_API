import { Router } from "express";
import { signUp, signIn, getMe } from "../controllers/user";
import { authentication } from "../middlewares/authentication";

const router: Router = Router();

// Define the routes for the user
router.post("/signup", signUp); // POST /v1/auth/signup
router.post("/signin", signIn); // POST /v1/auth/signin
router.get("/me", authentication, getMe); // GET /v1/auth/me

export default router;
