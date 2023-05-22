import { Router } from "express";
import { shortenUrl } from "../controllers/url.controller.js";
import { urlSchema } from "../schemas/url.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { shortenURLMiddleware } from "../middlewares/url.middleware.js";
import { getUrlById } from "../controllers/url.controller.js";
import { openUrl } from "../controllers/url.controller.js";

const urlsRouter = Router();

urlsRouter.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  shortenURLMiddleware,
  shortenUrl
);

urlsRouter.get("/urls/:id", getUrlById);

urlsRouter.get("/urls/open/:shortUrl", openUrl);

export default urlsRouter;
