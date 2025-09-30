<script setup lang="ts">
import { ref, reactive } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { registerAdmin } from "@/api/user";
import { toast } from "vue-sonner";
import { store } from "@/redux/store";

const isOpen = ref(false);

const closeDialog = () => {
  isOpen.value = false;
};

export interface Role {
  id: number;
  name: string;
}
const roles = ref<Role[]>([]);

const formData = reactive({
  username: "",
  email: "",
  password: "",
  role: null as number | null,
});

const errors = reactive({
  username: "",
  email: "",
  password: "",
  role: "",
});

const resetErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = "";
  });
};

const validateForm = () => {
  resetErrors();
  let isValid = true;

  if (!formData.username.trim()) {
    errors.username = "กรุณากรอกชื่อผู้ใช้";
    isValid = false;
  } else if (formData.username.length < 2) {
    errors.username = "Username ต้องมีอย่างน้อย 2 ตัวอักษร";
    isValid = false;
  } else if (formData.username.length > 50) {
    errors.username = "Username ยาวเกินไป";
    isValid = false;
  }

  if (!formData.email.trim()) {
    errors.email = "กรุณากรอกอีเมล";
    isValid = false;
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = "อีเมลไม่ถูกต้อง";
      isValid = false;
    }
  }

  if (!formData.password.trim()) {
    errors.password = "กรุณากรอกรหัสผ่าน";
    isValid = false;
  } else if (formData.password.length < 6) {
    errors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    isValid = false;
  }

  return isValid;
};

// ฟังก์ชันสำหรับแปลงค่า role เป็น label
const getRoleLabel = (value: number | undefined): string => {
  if (value === 1) return "แอดมิน";
  if (value === 2) return "ผู้ใช้งาน";
  if (value === 3) return "หัวหน้าแอดมิน";
  return "";
};

// Submit form
const onSubmit = async () => {
  if (validateForm()) {
    const register = await registerAdmin(
      formData.username,
      formData.email,
      formData.password,
      formData.role
    );
    toast.promise(register, {
      loading: "กำลังลงทะเบียน...",
      success: (_data: any) => {
        closeDialog();
        Object.assign(formData, {
          username: "",
          email: "",
          password: "",
          role: null,
        });
        return `ลงทะ้บียนเสร็จสิ้น`;
      },
      error: (err: any) => err || "ลงทะ้บียนผิดพลาด",
    });
  }
};

// Real-time validation (optional)
const validateField = (field: string) => {
  switch (field) {
    case "username":
      if (!formData.username.trim()) {
        errors.username = "กรุณากรอกชื่อผู้ใช้";
      } else if (formData.username.length < 2) {
        errors.username = "Username ต้องมีอย่างน้อย 2 ตัวอักษร";
      } else if (formData.username.length > 50) {
        errors.username = "Username ยาวเกินไป";
      } else {
        errors.username = "";
      }
      break;

    case "email":
      if (!formData.email.trim()) {
        errors.email = "กรุณากรอกอีเมล";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          errors.email = "อีเมลไม่ถูกต้อง";
        } else {
          errors.email = "";
        }
      }
      break;

    case "password":
      if (!formData.password.trim()) {
        errors.password = "กรุณากรอกรหัสผ่าน";
      } else if (formData.password.length < 6) {
        errors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
      } else {
        errors.password = "";
      }
      break;
  }
};

store.subscribe(async () => {
  const state = store.getState();
  roles.value = state.app.roles;
});
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button variant="default">เพิ่มผู้ใช้งาน</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>เพิ่มผู้ใช้งาน</DialogTitle>
        <DialogDescription> กรอกข้อมูลผู้ใช้งานแล้วกดบันทึก </DialogDescription>
      </DialogHeader>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-5">
        <!-- Username -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">ชื่อผู้ใช้</label>
          <Input
            type="username"
            v-model="formData.username"
            placeholder="กรอกชื่อผู้ใช้"
            @blur="validateField('username')"
            :class="errors.username ? 'border-red-500' : ''"
          />
          <span v-if="errors.username" class="text-sm text-red-500">{{
            errors.username
          }}</span>
        </div>

        <!-- Email -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Email</label>
          <Input
            type="email"
            v-model="formData.email"
            placeholder="กรอกอีเมล"
            @blur="validateField('email')"
            :class="errors.email ? 'border-red-500' : ''"
          />
          <span v-if="errors.email" class="text-sm text-red-500">{{
            errors.email
          }}</span>
        </div>

        <!-- Password -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">Password</label>
          <Input
            type="password"
            v-model="formData.password"
            placeholder="กรอกรหัสผ่าน"
            @blur="validateField('password')"
            :class="errors.password ? 'border-red-500' : ''"
          />
          <span v-if="errors.password" class="text-sm text-red-500">{{
            errors.password
          }}</span>
        </div>

        <!-- Role Select -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">สิทธิ์เข้าใช้งาน</label>
          <Select
            :model-value="formData.role ? formData.role.toString() : null"
            @update:model-value="
              (val) => {
                formData.role = Number(val);
              }
            "
          >
            <SelectTrigger
              class="w-full"
              :class="errors.role ? 'border-red-500' : ''"
            >
              <SelectValue>
                {{
                  formData.role
                    ? getRoleLabel(formData.role)
                    : "เลือกสิทธิ์เข้าใช้งาน"
                }}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>เลือกสิทธิ์</SelectLabel>
                <SelectItem
                  v-for="role in roles"
                  :key="role.id"
                  :value="role.id"
                >
                  {{ role.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <span v-if="errors.role" class="text-sm text-red-500">{{
            errors.role
          }}</span>
        </div>

        <DialogFooter>
          <Button type="submit">เพิ่มผู้ใช้งาน</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
