"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors")); // ✅ เพิ่ม cors
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const kpi_routes_1 = __importDefault(require("./routes/kpi.routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const yamljs_1 = __importDefault(require("yamljs"));
const initialData_1 = require("./config/initialData");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // ❌ ไม่ใช้ "*"
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, // ✅ ต้องมีถ้าใช้ cookies
    exposedHeaders: ["Authorization"], // optional
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const API_VERSION = process.env.API_VERSION || "/api/v1";
app.use(API_VERSION, auth_routes_1.default);
app.use(API_VERSION, user_routes_1.default);
app.use(API_VERSION, kpi_routes_1.default);
const swaggerDocument = yamljs_1.default.load("./docs/swagger.yaml");
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// เสริม: endpoint JSON
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocument);
});
app.listen(port, async () => {
    console.log(`🚀 Server run  await initialData(); // ✅ สร้างข้อมูลตั้งต้น runing at http://localhost:${port}`);
    await (0, initialData_1.initialData)(); // ✅ สร้างข้อมูลตั้งต้น
});
