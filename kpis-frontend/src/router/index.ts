import { createRouter, createWebHistory } from "vue-router";
import DefaultLayout from "../layout/DefaultLayout.vue";
import Dashboard from "../views/Dashboard/Dashboard.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import { checkSession } from "@/api/auth";
import ManageMentUser from "@/views/ManagementUser/ManagementUser.vue";
import ManagementKpiAdmin from "@/views/ManagementKpiAdmin/ManagementKpiAdmin.vue";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Forbidden from "@/views/Forbidden.vue";

export const routes = [
  {
    path: "/",
    name: "Main",
    component: DefaultLayout,
    redirect: "/dashboard",
    children: [
      {
        path: "/dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: {
          role: ["Admin", "User", "SuperAdmin"], // ✅ SuperAdmin เข้าได้
          isShow: true,
          requiresAuth: true,
        },
      },
      {
        path: "/kpis",
        name: "ชี้วัดผลการปฏิบัติงาน",
        component: ManagementKpiAdmin,
        meta: {
          role: ["Admin", "User", "SuperAdmin"], // ✅ SuperAdmin เข้าได้
          isShow: true,
          requiresAuth: true,
        },
      },
      {
        path: "/management/users",
        name: "ManagementUsers",
        component: ManageMentUser,
        meta: {
          role: ["Admin", "SuperAdmin"], // ✅ SuperAdmin มีสิทธิ์
          isShow: true,
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/403",
    name: "Forbidden",
    component: Forbidden,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// ✅ ฟังก์ชันตรวจสอบ role (รองรับทั้ง string และ array)
function checkUserAccess(routeMeta: any, userRole: string): boolean {
  const requiredRole = routeMeta?.role;
  if (!requiredRole) return true;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

// ✅ Middleware ก่อนเปลี่ยนหน้า
router.beforeEach(async (to, _from, next) => {
  // ถ้าไปหน้า login/register ไม่ต้องเช็ค token
  if (to.name === "Login" || to.name === "Register") {
    const user = await checkSession();
    const token = Cookies.get("token");

    if (user && token) {
      try {
        const decoded: { exp: number } = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) return next({ name: "Dashboard" });
      } catch {
        // token invalid → ปล่อยผ่าน
      }
    }
    return next();
  }

  const requiresAuth = to.meta.requiresAuth;
  const token = Cookies.get("token");

  if (!token) {
    if (requiresAuth) return next({ name: "Login" });
    return next();
  }

  try {
    const decoded: { exp: number } = jwtDecode(token);
    const now = Date.now() / 1000;

    if (decoded.exp < now) {
      return next({ name: "Login" }); // token หมดอายุ
    }

    const user = await checkSession();

    if (requiresAuth && !user) {
      console.log("❌ Auth required but no user found");
      return next({ name: "Login" });
    }

    // ✅ ตรวจสอบ role
    if (user && !checkUserAccess(to.meta, user.role)) {
      console.log("❌ Access denied - redirecting to 403");
      return next({ name: "Forbidden" });
    }
  } catch {
    return next({ name: "Login" });
  }

  next();
});

export default router;
