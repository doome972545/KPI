<script setup lang="ts">
import { getAllKpi } from "@/api/kpi";
import { getAllRoleUser } from "@/api/user";
import { isReload } from "@/redux/slice/appSlice";
import { store } from "@/redux/store";
import {
  columnsManageKpiAdmin,
  type KpiAdmin,
} from "@/views/ManagementKpiAdmin/_components/columnsManageKpiAdmin";
import DataTableKpiAdmin from "@/views/ManagementKpiAdmin/_components/data-table-Kpi-Admin.vue";
import DialogAddTask from "@/views/ManagementKpiAdmin/_components/DialogAddTask.vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { onMounted, ref } from "vue";
const data = ref<KpiAdmin[]>([]);
const users = ref<any[]>([]);
const user = store.getState().app.user;
const columns = ref<ColumnDef<KpiAdmin>[]>([]);

async function getAllKpis(): Promise<KpiAdmin[]> {
  try {
    const res = await getAllKpi();
    return res;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    return [];
  }
}
async function fetchUsers() {
  try {
    const res = await getAllRoleUser();

    return (Array.isArray(res) ? res : [])
      .filter((user: any) => user.role.name !== "Admin")
      .map((user: any) => ({
        id: user.id,
        username: user.username,
        role: user.role.name,
        email: user.email,
        roleId: user.roleId,
      }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

onMounted(async () => {
  data.value = await getAllKpis();
  users.value = await fetchUsers();
  columns.value = columnsManageKpiAdmin(users.value);
});

store.subscribe(async () => {
  const state = store.getState();
  if (state.app.reload) {
    store.dispatch(isReload(false));
    data.value = await getAllKpis();
  }
});
</script>

<template>
  <div class="container py-5 mx-auto">
    <div class="flex justify-end mb-4">
      <DialogAddTask :users="users" :user="user" />
    </div>
    <DataTableKpiAdmin :columns="columns" :data="data" />
  </div>
</template>
