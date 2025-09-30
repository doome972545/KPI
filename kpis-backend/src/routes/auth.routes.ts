import express, { Response } from "express";
import { rootCertificates } from "tls";
import { auth, login, logout, register } from "../controllers/Auth.Controller";
import { authenticateJWT, AuthRequest, RoleName } from "../middleware/auth";

const router = express.Router();

router.post("/auth/login", login);
router.post("/auth/register", register);
router.post(
  "/auth/logout",
  authenticateJWT([RoleName.ADMIN, RoleName.SUPERADMIN, RoleName.USER]),
  logout
);
router.get(
  "/auth",
  authenticateJWT([RoleName.ADMIN, RoleName.SUPERADMIN, RoleName.USER]),
  auth
);

export default router;
