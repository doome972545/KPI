<script setup lang="ts">
import { getAllRoleUser, getRoles } from "@/api/user";
import { addRole, isReload } from "@/redux/slice/appSlice";
import { store } from "@/redux/store";
import {
  columnsManageUser,
  type User,
} from "@/views/ManagementUser/_components/columnsManageUser";
import DataTableManageUser from "@/views/ManagementUser/_components/data-table-ManageUser.vue";
import DialogAddUser from "@/views/ManagementUser/_components/DialogAddUser.vue";
import { onMounted, ref } from "vue";
import { toast } from "vue-sonner";

const data = ref<User[]>([]);

async function getUsers(): Promise<User[]> {
  try {
    const res = await getAllRoleUser(); // ได้ array มา

    return (Array.isArray(res) ? res : []).map((user: any) => ({
      id: user.id, // ใน JSON ของคุณใช้ "id" ไม่ใช่ "uid"
      username: user.username,
      role: user.role && user.role.name, // กัน role null
      email: user.email,
      roleId: user.roleId,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

onMounted(async () => {
  data.value = await getUsers();
});

store.subscribe(async () => {
  const state = store.getState();
  if (state.app.reload) {
    store.dispatch(isReload(false));
    data.value = await getUsers();
  }
});

const fetchRoles = async () => {
  try {
    const res = await getRoles();
    return res;
  } catch (error: any) {
    toast.error(error);
    return;
  }
};

onMounted(async () => {
  store.dispatch(addRole(await fetchRoles()));
});
</script>
<template>
  <div class="container py-5 mx-auto">
    <div class="flex justify-end mb-4">
      <DialogAddUser />
    </div>
    <DataTableManageUser :columns="columnsManageUser" :data="data" />
  </div>
</template>
