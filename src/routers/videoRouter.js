import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  getDelete,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.fields([{ name: "video" }, { name: "thumb" }]), postUpload);
videoRouter.get("/:id", watch);
videoRouter
  .route("/:id/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.route("/:id/delete").all(protectorMiddleware).get(getDelete);
export default videoRouter;
