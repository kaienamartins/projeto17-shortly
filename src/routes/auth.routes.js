import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";
import {
  signInMiddleware,
  signUpMiddleware,
} from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  signUp,
  signUpMiddleware
);
authRouter.post(
  "/signin",
  signIn,
  signInMiddleware
);

export default authRouter;
