import { Router } from "express";

import {
  login,
  register,
  logout,
  loginEducator,
  registerEducator,
  getuserinfo,
  getchat,
} from "../controllers/authController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/loginEducator", loginEducator);
router.post("/registerEducator", registerEducator);
router.get("/getuserinfo", verifyToken, getuserinfo);
router.post("/chat", getchat);

export default router;
