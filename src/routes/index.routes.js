import { Router } from "express";
import authRouter from "./auth.routes.js";
import urlsRouter from "./urls.routes.js";

const router = Router();

router.use(authRouter, urlsRouter);

export default router;
