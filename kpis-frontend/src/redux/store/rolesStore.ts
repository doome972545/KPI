// src/stores/rolesStore.ts
import { ref } from "vue";
import type { Role } from "@/views/ManagementUser/_components/DialogAddUser.vue";

export const roles = ref<Role[]>([]);
