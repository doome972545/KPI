// api/auth.ts
import { apiClient } from "@/config/api-client";
import { CHECKSESSION, LOGIN, LOGOUT } from "@/config/contants";
import { isLoading, setUser } from "@/redux/slice/appSlice";
import { store } from "@/redux/store";

export async function loginUser(username: string, password: string) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.post(LOGIN, { username, password });
    store.dispatch(setUser(res.data.user));
    store.dispatch(isLoading(false));
    return res.data;
} catch (error: any) {
      store.dispatch(isLoading(false)); 
    throw error.response?.data.error;
  }
}

export async function checkSession() {
  try {
    const res = await apiClient.get(CHECKSESSION);
    return res.data.user;
  } catch (error) {
    return null;
  }
}

export async function logout() {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.post(LOGOUT);
    store.dispatch(isLoading(false));
    return res.data;
  } catch (error) {
    return null;
  }
}
