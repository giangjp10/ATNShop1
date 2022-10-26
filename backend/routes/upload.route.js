import express from "express";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.route("/").post(uploadImage);

export default router;
