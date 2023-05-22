import { Router } from "express";
import { signIn, signUp } from "../controllers/auth.controller.js";
import {
  signInMiddleware,
  signUpMiddleware,
} from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { userSchema, userLoginSchema } from "../schemas/users.schema.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  validateSchema(userSchema),
  signUpMiddleware,
  signUp
);

authRouter.post(
  "/signin",
  validateSchema(userLoginSchema),
  signInMiddleware,
  signIn
);

export default authRouter;
