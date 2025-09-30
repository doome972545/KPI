<script setup lang="ts">
import { MoreHorizontal } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { onMounted, reactive, ref, watch } from "vue";
import Modal from "@/components/Modal.vue";
import Label from "@/components/ui/label/Label.vue";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Role } from "@/views/ManagementUser/_components/DialogAddUser.vue";
import type { User } from "@/views/ManagementUser/_components/columnsManageUser";
import { store } from "@/redux/store";
import { toast } from "vue-sonner";
import { changeRole } from "@/api/user";
const props = defineProps<{
  user: User;
}>();

const open = ref(false);
const roles = ref<Role[]>([]);
const formData = reactive({
  id: 0,
  role: null as number | null,
});

const getRoleLabel = (value: number | null): string => {
  if (value === null) return "ยกเลิกสิทธิ์";
  if (value === 1) return "แอดมิน";
  if (value === 2) return "ผู้ใช้งาน";
  return "";
};

const handleSubmit = async () => {
  try {
    const res = await changeRole(formData.id, formData.role);
    toast.promise(res, {
      loading: "กำลังเปลี่ยนสิทธิ์...",
      success: (_data: any) => {
        open.value = false;
        return `เปลี่ยนสิทธิ์สำเร็จ`;
      },
      error: (err: any) => err || "error",
    });
  } catch (err: any) {
    toast.error(err);
    return;
  }
};
onMounted(() => {
  const state = store.getState();
  const currentRole = state.app.user?.role;

  let allRoles = state.app.roles;

  if (currentRole === "SuperAdmin") {
    allRoles = allRoles.filter((r: Role) => r.name !== "SuperAdmin");
  }

  roles.value = allRoles;
});
watch(
  () => props.user,
  (newUser) => {
    formData.role = newUser.roleId ?? null;
    formData.id = Number(newUser.id);
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <span class="sr-only">Open menu</span>
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Actions</DropdownMenuLabel>
      <DropdownMenuItem @click="open = true">
        รายละเอียดผู้ใช้งาน
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <Modal
    v-model="open"
    title="ข้อมูลผู้ใช้"
    description="รายละเอียดข้อมูลผู้ใช้งาน"
  >
    <div class="flex flex-col gap-3">
      <div class="flex flex-col gap-2">
        <Label>ชื่อผู้ใช้</Label>
        <Input v-model="user.username" disabled class="border border-black" />
      </div>
      <div class="flex flex-col gap-2">
        <Label>อีเมล</Label>
        <Input v-model="user.email" disabled class="border border-black" />
      </div>
      <div class="flex flex-col gap-2">
        <Label>สิทธิ์เข้าใช้งาน</Label>

        <div>
          <Select
            :model-value="formData.role ? formData.role.toString() : null"
            @update:model-value="
              (val) => {
                if (val === 'none') {
                  formData.role = null; // ยกเลิกสิทธิ์
                } else {
                  formData.role = Number(val);
                }
              }
            "
          >
            <SelectTrigger class="w-full border border-gray-400">
              <SelectValue>
                {{
                  formData.role
                    ? getRoleLabel(formData.role)
                    : getRoleLabel(formData.role)
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>เลือกสิทธิ์</SelectLabel>
                <SelectItem
                  v-for="el in roles"
                  :key="el.id"
                  :value="el.id.toString()"
                >
                  {{ el.name }}
                </SelectItem>
                <SelectItem
                  value="none"
                  v-if="formData.role === 2 || formData.role === 1"
                  >ยกเลิกสิทธิ์</SelectItem
                >
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button @click="handleSubmit">บันทึกการเปลี่ยนแปลง</Button>
    </div>
  </Modal>
</template>
