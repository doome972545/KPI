import express from "express";
import dotenv from "dotenv";
import cors from "cors"; // ✅ เพิ่ม cors
import authController from "../src/routes/auth.routes";
import userController from "../src/routes/user.routes";
import kpiController from "../src/routes/kpi.routes";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../src/config/swagger";
import YAML from "yamljs";
import { initialData } from "../src/config/initialData";
import os from "os";

const interfaces = os.networkInterfaces();

for (const name in interfaces) {
  for (const iface of interfaces[name]!) {
    if (iface.family === "IPv4" && !iface.internal) {
      console.log("IP เครื่อง:", iface.address);
    }
  }
}
dotenv.config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(
  cors({
    origin: "*", // ❌ ไม่ใช้ "*"
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, // ✅ ต้องมีถ้าใช้ cookies
    exposedHeaders: ["Authorization"], // optional
  })
);
app.use(cookieParser());
app.use(express.json());

const API_VERSION = process.env.API_VERSION || "/api/v1";

app.use(API_VERSION, authController);
app.use(API_VERSION, userController);
app.use(API_VERSION, kpiController);

const swaggerDocument = YAML.load("./docs/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// เสริม: endpoint JSON
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

app.listen(port, async () => {
  console.log(
    `🚀 Server run  await initialData(); // ✅ สร้างข้อมูลตั้งต้น runing at http://localhost:${port}`
  );
  await initialData(); // ✅ สร้างข้อมูลตั้งต้น
});
