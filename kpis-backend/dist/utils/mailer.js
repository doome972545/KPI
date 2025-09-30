"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendMail = async (to, subject, kpiData) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const html = `
  <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
    <h2 style="color: #1E40AF;">📊 KPI Updated Notification</h2>
    <p>The KPI "<strong>${kpiData.title}</strong>" has been updated.</p>

    <table style="border-collapse: collapse; width: 100%; margin-top: 16px;">
      <thead>
        <tr>
          <th style="border: 1px solid #ccc; padding: 8px; background: #1E40AF; color: #fff;">KPI</th>
          <th style="border: 1px solid #ccc; padding: 8px; background: #1E40AF; color: #fff;">actualValue</th>
          <th style="border: 1px solid #ccc; padding: 8px; background: #1E40AF; color: #fff;">Target Value</th>
          <th style="border: 1px solid #ccc; padding: 8px; background: #1E40AF; color: #fff;">Status</th>
          <th style="border: 1px solid #ccc; padding: 8px; background: #1E40AF; color: #fff;">Comment</th>
          <th style="border: 1px solid #ccc; padding: 8px; background: #1E40AF; color: #fff;">Updated By</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="border: 1px solid #ccc; padding: 8px;">${kpiData.title}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${kpiData.updatedValue}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${kpiData.targetValue}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${kpiData.status}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${kpiData.comment || "-"}</td>
          <td style="border: 1px solid #ccc; padding: 8px;">${kpiData.updatedBy || "-"}</td>
        </tr>
      </tbody>
    </table>

    <p style="margin-top: 16px;">Thank you,<br/>KPI System</p>
  </div>
  `;
    await transporter.sendMail({
        from: `"KPI System" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};
exports.sendMail = sendMail;
