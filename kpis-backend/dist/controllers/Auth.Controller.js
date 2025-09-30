"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.auth = exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = require("jsonwebtoken");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
    try {
        const data = req.body;
        const { username, email, password } = data;
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
exports.register = register;
const login = async (req, res) => {
    try {
        const data = req.body;
        const { username, password } = data;
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
            include: { role: true }, // ดึง role มาด้วย
        });
        if (!user) {
            return res.status(400).json({ error: "ไม่พบผู้ใช่งาน" });
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });
        }
        const token = (0, jsonwebtoken_1.sign)({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role?.name,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token, {
            //   httpOnly: true,
            httpOnly: false,
            secure: process.env.NODE_ENV === "production", // true ใน production
            sameSite: "lax",
            maxAge: 1000 * 60 * 60, // 1 ชั่วโมง
        });
        return res.status(200).json({
            message: "เข้าสู่ระบบสำเร็จ",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role?.name,
            },
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.login = login;
const auth = async (req, res) => {
    try {
        return res.status(200).json({ user: req.user });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.auth = auth;
const logout = async (req, res) => {
    try {
        // ลบ cookie token
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
        return res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.logout = logout;
