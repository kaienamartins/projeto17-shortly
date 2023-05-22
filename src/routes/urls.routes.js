import { Router } from "express";
import { shortenUrl } from "../controllers/url.controller.js";
import { urlSchema } from "../schemas/url.schema.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { shortenURLMiddleware } from "../middlewares/url.middleware.js";
import { getUrlById } from "../controllers/url.controller.js";
import { getUrlByIdMiddleware } from "../middlewares/url.middleware.js";
import { openUrl } from "../controllers/url.controller.js";
import { openUrlMiddleware } from "../middlewares/url.middleware.js";
import { deleteUrl } from "../controllers/url.controller.js";
import { deleteUrlMiddleware } from "../middlewares/url.middleware.js";
import { userUrls } from "../controllers/url.controller.js";
import { userUrlsMiddleware } from "../middlewares/url.middleware.js";
import { getRanking } from "../controllers/url.controller.js";

const urlsRouter = Router();

urlsRouter.post(
  "/urls/shorten",
  validateSchema(urlSchema),
  shortenURLMiddleware,
  shortenUrl
);

urlsRouter.get("/urls/:id", getUrlByIdMiddleware, getUrlById);

urlsRouter.get("/urls/open/:shortUrl", openUrlMiddleware, openUrl);

urlsRouter.delete("/urls/:id", deleteUrlMiddleware, deleteUrl);

urlsRouter.get("/users/me", userUrlsMiddleware, userUrls);

urlsRouter.get("/ranking", getRanking);

export default urlsRouter;
