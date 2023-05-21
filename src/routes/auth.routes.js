import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";
import {
  signInMiddleware,
  signUpMiddleware,
} from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", signUpMiddleware, signUp);

authRouter.post("/signin", signInMiddleware, signIn);

export default authRouter;
