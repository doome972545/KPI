export const HOST_BASE = import.meta.env.VITE_API_BASE;

// Auth
export const LOGIN = `${HOST_BASE}/auth/login`;
export const CHECKSESSION = `${HOST_BASE}/auth`;
export const LOGOUT = `${HOST_BASE}/auth/logout`;

// User
export const GET_ALL_ROLE_USER = `${HOST_BASE}/users`;
export const GET_ROLE = `${HOST_BASE}/roles`;
export const REGISTER_ADMIN = `${HOST_BASE}/register/admin`;
export const CHANGE_ROLE = `${HOST_BASE}/users/role`;

// Kpi
export const CREATE_KPI = `${HOST_BASE}/kpis`;
export const GET_ALL_KPI = `${HOST_BASE}/kpis`;
export const UPDATE_KPI = `${HOST_BASE}/kpis`;
export const UPDATE_VALUE_KPI = `${HOST_BASE}/kpis`;
export const DELETE_KPI = `${HOST_BASE}/kpis`;
export const DASHBOARD = `${HOST_BASE}/kpis/dashboard`;

// export const REGISTER = `${HOST_BASE}/user/register`;
// export const UPDATE_USER = `${HOST_BASE}/user`;
// export const GET_ALL_USER = `${HOST_BASE}/user`;
// export const DELETE_USER = `${HOST_BASE}/user`;
