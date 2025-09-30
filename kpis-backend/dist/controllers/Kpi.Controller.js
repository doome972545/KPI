"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteKpi = exports.updateValueKpi = exports.updateKpis = exports.getAllKpis = exports.createKpis = void 0;
const client_1 = require("@prisma/client");
const mailer_1 = require("../utils/mailer");
const prisma = new client_1.PrismaClient();
const createKpis = async (req, res) => {
    try {
        const data = await req.body;
        const { id, // id ผู้รับผิดชอบ
        title, description, targetValue, goalType, startDate, endDate, } = data;
        const kpiCreate = await prisma.kpi.create({
            data: {
                assignedUser: id ?? null,
                title,
                description,
                targetValue,
                goalType,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
            },
        });
        // ดึง Admin และ SuperAdmin
        const adminUsers = await prisma.user.findMany({
            where: { role: { name: { in: ["Admin", "SuperAdmin"] } } },
        });
        const notifications = adminUsers.map((admin) => prisma.kpiNotification.create({
            data: {
                kpiId: kpiCreate.id,
                userId: admin.id,
            },
        }));
        // ถ้า assignedUser ถูกส่งมา → เพิ่ม notify ของ user คนนั้น
        if (id && req.user?.role !== "User") {
            notifications.push(prisma.kpiNotification.create({
                data: {
                    kpiId: kpiCreate.id,
                    userId: Number(id),
                },
            }));
        }
        // ถ้าคนสร้างไม่ใช่ Admin/SuperAdmin → notify คนสร้างด้วย
        if (req.user?.id &&
            req.user?.role !== "Admin" &&
            req.user?.role !== "SuperAdmin") {
            notifications.push(prisma.kpiNotification.create({
                data: {
                    kpiId: kpiCreate.id,
                    userId: Number(req.user?.id),
                },
            }));
        }
        await Promise.all(notifications);
        return res.status(200).json(kpiCreate);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.createKpis = createKpis;
const getAllKpis = async (req, res) => {
    try {
        const user = req.user;
        const kpis = await prisma.kpi.findMany({
            where: user?.role !== "User" ? {} : { assignedUser: Number(user?.id) }, // ✅ แปลงเป็น number
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return res.status(200).json(kpis);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getAllKpis = getAllKpis;
const updateKpis = async (req, res) => {
    try {
        const { title, description, targetValue, assignedUser } = req.body;
        const { id } = req.params;
        const existKpi = await prisma.kpi.findUnique({
            where: { id: Number(id) },
            include: {
                user: { select: { id: true, role: true, email: true } },
            },
        });
        if (!existKpi) {
            return res.status(404).json({ error: "KPI not found" });
        }
        // ✅ update KPI
        const updatedKpi = await prisma.kpi.update({
            where: { id: Number(id) },
            data: {
                title,
                description,
                targetValue,
                assignedUser: assignedUser ? Number(assignedUser) : null,
            },
        });
        // ✅ ถ้ามี assignedUser ใหม่ → update kpiNotification
        if (assignedUser) {
            const newAssignedUser = await prisma.user.findUnique({
                where: { id: Number(assignedUser) },
                select: { id: true, email: true, role: true },
            });
            if (newAssignedUser?.role?.name === "User") {
                // ลบ notification เดิมของ user ที่เคยรับผิดชอบ
                await prisma.kpiNotification.deleteMany({
                    where: {
                        kpiId: Number(id),
                        user: {
                            role: { name: "User" },
                        },
                    },
                });
                // เพิ่ม notification ให้กับ user คนใหม่
                await prisma.kpiNotification.create({
                    data: {
                        kpiId: Number(id),
                        userId: newAssignedUser.id,
                    },
                });
            }
        }
        return res.status(200).json(updatedKpi);
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.updateKpis = updateKpis;
const updateValueKpi = async (req, res) => {
    try {
        const kpiUpdateData = await req.body;
        const { kpi_id, updated_value, comment } = kpiUpdateData;
        const id = req.user?.id;
        const updateValue = await prisma.kpiUpdate.create({
            data: {
                kpiId: Number(kpi_id),
                updatedBy: Number(id),
                updatedValue: Number(updated_value),
                comment: comment || null,
            },
        });
        const kpi = await prisma.kpi.findUnique({
            where: { id: Number(kpi_id) },
            select: {
                title: true,
                targetValue: true,
                goalType: true,
                notifications: {
                    select: {
                        user: {
                            select: { email: true },
                        },
                    },
                },
            },
        });
        const status = getKpiStatus(Number(updated_value), Number(kpi?.targetValue), kpi?.goalType);
        await prisma.kpi.update({
            where: { id: Number(kpi_id) },
            data: { status, actualValue: Number(updated_value) },
        });
        // ✅ ส่ง Email ไปยังทุกคนที่อยู่ใน notifications
        if (kpi?.notifications && kpi.notifications.length > 0) {
            const recipients = kpi.notifications
                .map((n) => n.user?.email)
                .filter((email) => !!email);
            for (const email of recipients) {
                await (0, mailer_1.sendMail)(email, `อัปเดต KPI: ${kpi?.title}`, {
                    title: kpi?.title || "",
                    updatedValue: updated_value,
                    targetValue: Number(kpi?.targetValue),
                    status,
                    comment,
                    updatedBy: req.user?.email || "Unknown",
                });
            }
        }
        return res.status(200).json({ ...updateValue, status });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.updateValueKpi = updateValueKpi;
function getKpiStatus(actualValue, targetValue, type) {
    if (targetValue === 0)
        return "Off Track";
    let progress = 0;
    if (type === "increase") {
        progress = (actualValue / targetValue) * 100;
    }
    else {
        progress = ((targetValue - actualValue) / targetValue) * 100;
    }
    if (progress >= 90)
        return "On Track";
    if (progress >= 70)
        return "At Risk";
    return "Off Track";
}
const deleteKpi = async (req, res) => {
    try {
        const { id } = req.params;
        const existKpi = await prisma.kpi.findUnique({
            where: { id: Number(id) },
        });
        if (!existKpi) {
            return res.status(404).json({ error: "KPI not found" });
        }
        await prisma.kpi.delete({
            where: { id: Number(id) },
        });
        return res.status(200).json({ message: "KPI deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.deleteKpi = deleteKpi;
