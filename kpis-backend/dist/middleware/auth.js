"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = exports.RoleName = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
var RoleName;
(function (RoleName) {
    RoleName["ADMIN"] = "Admin";
    RoleName["USER"] = "User";
    RoleName["SUPERADMIN"] = "SuperAdmin";
})(RoleName || (exports.RoleName = RoleName = {}));
// allowRoles ต้องเป็น RoleName[]
const authenticateJWT = (allowRoles) => {
    return (req, res, next) => {
        const token = req.cookies?.token;
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No token provided" });
        }
        try {
            const payload = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
            if (!allowRoles.includes(payload.role)) {
                return res
                    .status(403)
                    .json({ message: "Forbidden: You don't have access" });
            }
            req.user = {
                id: payload.id,
                username: payload.username,
                email: payload.email,
                role: payload.role,
            };
            next();
        }
        catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    };
};
exports.authenticateJWT = authenticateJWT;
