import express from "express";
import { sendMessage, getMessage } from "../controller/message.controller.js";
import upload from "../middleware/upload.js";
import secureRoute from "../middleware/secureRoute.js";
import {verifyJWT} from "../middleware/verifyJWT.js";

const router = express.Router();
// router.post("/send/:id", secureRoute, sendMessage);
router.post(
  "/send/:id",
  secureRoute,
  upload.single("file"), // ✅ handles multipart/form-data
  verifyJWT,
  sendMessage
);
router.get("/get/:id", secureRoute, getMessage);
// router.post("/send/:id", upload.single("file"), verifyJWT, sendMessage);
export default router;
