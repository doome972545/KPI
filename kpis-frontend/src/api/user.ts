// api/auth.ts
import { apiClient } from "@/config/api-client";
import {
  CHANGE_ROLE,
  GET_ALL_ROLE_USER,
  GET_ROLE,
  REGISTER_ADMIN,
} from "@/config/contants";
import { isLoading, isReload } from "@/redux/slice/appSlice";
import { store } from "@/redux/store";

export async function getAllRoleUser() {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.get(GET_ALL_ROLE_USER);
    store.dispatch(isLoading(false));
    return res.data;
  } catch (error: any) {
    throw error.response?.data.error;
  }
}

export async function registerAdmin(
  username: string,
  email: string,
  password: string,
  role: number | null
) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.post(REGISTER_ADMIN, {
      username,
      email,
      password,
      role,
    });
    store.dispatch(isReload(true));
    store.dispatch(isLoading(false));
    return res.data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data.error;
  }
}
export async function getRoles() {
  try {
    const res = await apiClient.get(GET_ROLE);
    return res.data;
  } catch (error: any) {
    throw error.response?.data.error;
  }
}

export async function changeRole(id: number, role: number | null) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.post(CHANGE_ROLE, { id, role });
    store.dispatch(isReload(true));
    store.dispatch(isLoading(false));
    return res.data;
  } catch (error: any) {
    throw error.response?.data.error;
  }
}
