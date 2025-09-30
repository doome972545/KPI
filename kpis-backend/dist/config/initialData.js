"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialData = void 0;
// src/config/initialData.ts
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const initialData = async () => {
    try {
        // ✅ สร้าง role เริ่มต้น
        const roles = ["Admin", "User", "SuperAdmin"];
        for (const role of roles) {
            await prisma.role.upsert({
                where: { name: role },
                update: {},
                create: { name: role, id: roles.indexOf(role) + 1 },
            });
        }
        // // ✅ สร้าง user แรก
        await prisma.user.upsert({
            where: { email: "super@gmail.com" },
            update: {},
            create: {
                email: "super@gmail.com",
                username: "superadmin",
                passwordHash: await bcrypt_1.default.hash("pass123", 10), // ✅ hash
                role: { connect: { name: "SuperAdmin" } }, // ✅ role ชื่อ Admin
            },
        });
        // // ✅ สร้าง KPI ตัวอย่าง
        // await prisma.kpi.upsert({
        //   where: { title: "ยอดขาย Q1" },
        //   update: {},
        //   create: {
        //     title: "ยอดขาย Q1",
        //     description: "KPI ตั้งต้นสำหรับไตรมาสแรก",
        //     targetValue: 100000,
        //     assignedUserId: 1, // ผูกกับ user แรก
        //   },
        // });
        console.log("✅ Initial data seeding success!");
    }
    catch (error) {
        console.error("❌ Error seeding initial data:", error);
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.initialData = initialData;
