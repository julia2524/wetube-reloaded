import express from "express";
import {
  allNotice,
  newNotice,
  postNotice,
} from "../controllers/noticeController";

const noticeRouter = express.Router();

noticeRouter.get("/all", allNotice);
noticeRouter.route("/new").get(newNotice).post(postNotice);

export default noticeRouter;
