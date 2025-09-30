import express from "express";
import { authenticateJWT, RoleName } from "../middleware/auth";
import {
  createKpis,
  deleteKpi,
  getAllDashboardKpis,
  getAllKpis,
  updateKpis,
  updateValueKpi,
} from "../controllers/Kpi.Controller";
const router = express.Router();

router.post(
  "/kpis",
  authenticateJWT([RoleName.ADMIN, RoleName.USER, RoleName.SUPERADMIN]),
  createKpis
);

router.get(
  "/kpis",
  authenticateJWT([RoleName.ADMIN, RoleName.USER, RoleName.SUPERADMIN]),
  getAllKpis
);

router.put(
  "/kpis/:id",
  authenticateJWT([RoleName.ADMIN, RoleName.USER, RoleName.SUPERADMIN]),
  updateKpis
);
router.post(
  "/kpis/update-value",
  authenticateJWT([RoleName.USER]),
  updateValueKpi
);

router.delete(
  "/kpis/:id",
  authenticateJWT([RoleName.ADMIN, RoleName.USER, RoleName.SUPERADMIN]),
  deleteKpi
);

router.get(
  "/kpis/dashboard",
  authenticateJWT([RoleName.ADMIN, RoleName.USER, RoleName.SUPERADMIN]),
  getAllDashboardKpis
);
export default router;
