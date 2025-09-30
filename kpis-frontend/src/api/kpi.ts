// api/auth.ts
import { apiClient } from "@/config/api-client";
import {
  CREATE_KPI,
  DASHBOARD,
  DELETE_KPI,
  GET_ALL_KPI,
  UPDATE_KPI,
  UPDATE_VALUE_KPI,
} from "@/config/contants";
import { isLoading, isReload } from "@/redux/slice/appSlice";
import { store } from "@/redux/store";
import type { KpiAdmin } from "@/views/ManagementKpiAdmin/_components/columnsManageKpiAdmin";

export interface CreateKpiDto {
  id?: number;
  title: string;
  description: string;
  targetValue: number;
  goalType: "increase" | "decrease";
  startDate: string;
  endDate: string;
}

export async function createKpis(value: CreateKpiDto) {
  store.dispatch(isLoading(true));
  const user = store.getState().app.user;

  try {
    // ถ้าเป็น User ให้แนบ id ของตัวเอง
    const payload = user?.role === "User" ? { ...value, id: user.id } : value;

    const res = await apiClient.post(CREATE_KPI, payload);

    store.dispatch(isLoading(false));
    store.dispatch(isReload(true));
    return res.data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data?.error || error.message;
  }
}
export async function getAllKpi() {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.get(GET_ALL_KPI);
    store.dispatch(isLoading(false));
    return res.data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data?.error || error.message;
  }
}
export async function updateKpi(value: KpiAdmin) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.put(`${UPDATE_KPI}/${value.id}`, value);
    store.dispatch(isLoading(false));
    store.dispatch(isReload(true));
    return res.data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data?.error || error.message;
  }
}
export async function updatedValueKpi(payload: {
  kpi_id: number;
  updated_value: number;
  comment?: string;
}) {
  try {
    store.dispatch(isLoading(true));

    const res = await apiClient.post(
      `${UPDATE_VALUE_KPI}/update-value`,
      payload
    );
    store.dispatch(isReload(true));
    store.dispatch(isLoading(false));

    return res.data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data?.error || error.message;
  }
}

export async function deleteKpiId(kpi_id: number) {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.delete(`${DELETE_KPI}/${kpi_id}`);
    store.dispatch(isLoading(false));
    store.dispatch(isReload(true));
    return res.data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data?.error || error.message;
  }
}

export async function getDashboard() {
  store.dispatch(isLoading(true));
  try {
    const res = await apiClient.get(DASHBOARD);
    store.dispatch(isLoading(false));
    return res.data;
  } catch (error: any) {
    store.dispatch(isLoading(false));
    throw error.response?.data?.error || error.message;
  }
}
