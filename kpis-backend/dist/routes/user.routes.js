"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Users_Controller_1 = require("../controllers/Users.Controller");
const router = express_1.default.Router();
// swagger
router.get("/users", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.SUPERADMIN, auth_1.RoleName.USER]), Users_Controller_1.getAllRoleUsers);
// swagger
router.get("/roles", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.SUPERADMIN]), Users_Controller_1.getRoles);
// swagger
router.post("/register/admin", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.SUPERADMIN]), Users_Controller_1.registerAdmin);
// swagger
router.post("/users/role", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.SUPERADMIN]), Users_Controller_1.changeRole);
exports.default = router;
