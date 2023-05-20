import { Router } from "express";
import UserController from "@controllers/v1/user";
import { authentication } from "@services/v1/authentication";

const router: Router = Router();

// Define the routes for the user
router.post("/signup", UserController.signUp); // POST /v1/auth/signup
router.post("/signin", UserController.signIn); // POST /v1/auth/signin
router.get("/me", authentication, UserController.getMe); // GET /v1/auth/me

export default router;
