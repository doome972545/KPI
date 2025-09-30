"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Kpi_Controller_1 = require("../controllers/Kpi.Controller");
const router = express_1.default.Router();
router.post("/kpis", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.USER, auth_1.RoleName.SUPERADMIN]), Kpi_Controller_1.createKpis);
router.get("/kpis", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.USER, auth_1.RoleName.SUPERADMIN]), Kpi_Controller_1.getAllKpis);
router.put("/kpis/:id", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.USER, auth_1.RoleName.SUPERADMIN]), Kpi_Controller_1.updateKpis);
router.post("/kpis/update-value", (0, auth_1.authenticateJWT)([auth_1.RoleName.USER]), Kpi_Controller_1.updateValueKpi);
router.delete("/kpis/:id", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.USER, auth_1.RoleName.SUPERADMIN]), Kpi_Controller_1.deleteKpi);
exports.default = router;
