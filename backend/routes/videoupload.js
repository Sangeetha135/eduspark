import {
  videoupload,
  getvideos,
  getvideo,
  setrating,
  quizques,
  comments,
  addcomment,
  updatereply,
  getsubtitles,
  getqueries,
  putquery,
  setanswer,
  getquery,
  relatedvideos,
} from "../controllers/videouploadController.js";

import { Router } from "express";

const router = Router();
import multer from "multer";
import path from "path";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024,
    fieldSize: 500 * 1024 * 1024,
  },
});

router.post("/videoupload", verifyToken, upload.single("video"), videoupload);
router.get("/getvideos", getvideos);
router.get("/getvideo/:id", getvideo);
router.put("/rating/:id", setrating);
router.get("/takequiz/:id", quizques);
router.get("/comments/:id", comments);
router.post("/putcomment/:id1/:id2", addcomment);
router.post("/reply/:id/:id2", updatereply);
router.get("/subtitles/:id/:id2", getsubtitles);
router.get("/query/getqueries", getqueries);
router.put("/putquery/:name", putquery);
router.put("/query/answer/:id", setanswer);
router.get("/query/:id", getquery);
router.get("/related/:videoId", relatedvideos);
export default router;
