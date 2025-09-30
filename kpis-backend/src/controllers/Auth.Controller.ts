import e, { Request, Response } from "express";
import { LoginDto, RegisterDto } from "../dto/AuthDto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();
export const register = async (req: Request, res: Response) => {
  try {
    const data: RegisterDto = req.body;
    const { username, email, password } = data;
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: username }, { email: email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username หรือ Email มีคนใช้แล้ว" });
    }
    const passwordHash = await bcrypt.hash(password, 10);

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
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data: LoginDto = req.body;
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
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" });
    }
    const token = sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role?.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      //   httpOnly: true,
      httpOnly: true,
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
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const auth = async (req: AuthRequest, res: Response) => {
  try {
    return res.status(200).json({ user: req.user });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
export const logout = async (req: AuthRequest, res: Response) => {
  try {
    // ลบ cookie token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};
