import { Router } from "express";
import { shortenUrl } from "../controllers/url.controller.js";
import { urlSchema } from "../schemas/url.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { shortenURLMiddleware } from "../middlewares/url.middleware.js";

const urlsRouter = Router();

urlsRouter.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  shortenURLMiddleware,
  shortenUrl
);

export default urlsRouter;
