"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeRole = exports.registerAdmin = exports.getRoles = exports.getAllRoleUsers = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const getAllRoleUsers = async (req, res) => {
    try {
        const role = req.user?.role;
        const users = await prisma.user.findMany({
            where: role === "SuperAdmin"
                ? {
                    OR: [
                        { role: null }, // คนที่ยังไม่มี role
                        { role: { name: { in: ["Admin", "User"] } } }, // SuperAdmin เอง
                    ],
                }
                : {
                    OR: [
                        { role: null }, // ยังไม่มี role
                        { role: { name: "User" } }, // เฉพาะ User
                    ],
                },
            select: {
                id: true,
                email: true,
                username: true,
                roleId: true,
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json(users);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getAllRoleUsers = getAllRoleUsers;
const getRoles = async (req, res) => {
    try {
        const roleUser = req.user?.role;
        const roles = await prisma.role.findMany({
            where: roleUser === "SuperAdmin"
                ? {}
                : {
                    NOT: {
                        name: { in: ["SuperAdmin", "Admin"] },
                    },
                },
        });
        console.log(roles);
        return res.status(200).json(roles);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getRoles = getRoles;
const registerAdmin = async (req, res) => {
    try {
        const data = req.body;
        const { username, email, password, role } = data;
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [{ username: username }, { email: email }],
            },
        });
        if (existingUser) {
            return res.status(400).json({ error: "Username หรือ Email มีคนใช้แล้ว" });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                email,
                passwordHash,
                roleId: role ?? null,
            },
            select: {
                id: true,
                email: true,
                role: true,
                roleId: true,
                username: true,
            },
        });
        return res.status(201).json({ user });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.registerAdmin = registerAdmin;
const changeRole = async (req, res) => {
    try {
        const data = await req.body;
        const { id, role } = data;
        const existingUser = await prisma.user.findFirst({
            where: { id },
        });
        if (!existingUser) {
            return res.status(400).json({ error: "ไม่พบ user" });
        }
        const changeRoles = await prisma.user.update({
            where: {
                id,
            },
            data: {
                roleId: role,
            },
            select: {
                id: true,
                email: true,
                role: true,
                roleId: true,
                username: true,
            },
        });
        return res.status(200).json(changeRoles);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.changeRole = changeRole;
