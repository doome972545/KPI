import express, { Response } from "express";
import { authenticateJWT, AuthRequest, RoleName } from "../middleware/auth";
import {
  changeRole,
  getAllRoleUsers,
  getRoles,
  registerAdmin,
} from "../controllers/Users.Controller";

const router = express.Router();
// swagger
router.get(
  "/users",
  authenticateJWT([RoleName.ADMIN, RoleName.SUPERADMIN, RoleName.USER]),
  getAllRoleUsers
);
// swagger
router.get(
  "/roles",
  authenticateJWT([RoleName.ADMIN, RoleName.SUPERADMIN]),
  getRoles
);
// swagger
router.post(
  "/register/admin",
  authenticateJWT([RoleName.ADMIN, RoleName.SUPERADMIN]),
  registerAdmin
);
// swagger
router.post(
  "/users/role",
  authenticateJWT([RoleName.ADMIN, RoleName.SUPERADMIN]),
  changeRole
);

export default router;
