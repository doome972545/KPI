import { Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: RoleName;
  };
}

export enum RoleName {
  ADMIN = "Admin",
  USER = "User",
  SUPERADMIN = "SuperAdmin",
}

// allowRoles ต้องเป็น RoleName[]
export const authenticateJWT = (allowRoles: RoleName[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    try {
      const payload = verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        username: string;
        email: string;
        role: RoleName; // ✅ ใช้ RoleName
      };

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
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
