"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_Controller_1 = require("../controllers/Auth.Controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/auth/login", Auth_Controller_1.login);
router.post("/auth/register", Auth_Controller_1.register);
router.post("/auth/logout", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.SUPERADMIN, auth_1.RoleName.USER]), Auth_Controller_1.logout);
router.get("/auth", (0, auth_1.authenticateJWT)([auth_1.RoleName.ADMIN, auth_1.RoleName.SUPERADMIN, auth_1.RoleName.USER]), Auth_Controller_1.auth);
exports.default = router;
