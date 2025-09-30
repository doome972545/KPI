<script setup lang="ts">
import { ref } from "vue";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "vue-sonner";
import { loginUser } from "@/api/auth";

// const email = ref("admin@gmail.com");
// const password = ref("pass123");
const emailError = ref("");
const formData = ref({
  username: "admin",
  password: "pass123",
});

function validateEmail() {
  if (!formData.value.username) {
    emailError.value = "กรุณากรอกชื่อผู้ใช้งาน";
  } else {
    emailError.value = "";
  }
}

async function handleSubmit(e: Event) {
  e.preventDefault();
  validateEmail();
  if (!formData.value.username || !formData.value.password) {
    toast.error("กรุณากรอกอีเมลและรหัสผ่าน");
    return;
  }
  if (emailError.value) return;
  try {
    const user = await loginUser(
      formData.value.username,
      formData.value.password
    );

    toast.promise(user, {
      loading: "กำลังเข้าสู่ระบบ...",
      success: (data: any) => `ยินดีต้อนรับ ${data.user.username} 🎉`,
      error: (err: any) => err || "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
    });

    location.reload();
  } catch (err: any) {
    toast.error(err);
    return;
  }
}
</script>

<template>
  <div
    class="h-screen w-screen flex justify-center items-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700"
  >
    <div
      class="min-w-[400px] bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col gap-6 border border-white/20"
    >
      <h1 class="text-center text-3xl font-bold text-white">เข้าสู่ระบบ</h1>
      <form class="flex flex-col gap-4" @submit="handleSubmit">
        <Input
          v-model="formData.username"
          type="username"
          placeholder="Username"
          class="bg-white/20 border-white/30 text-white placeholder:text-white/70"
        />
        <span v-if="emailError" class="text-red-400 text-sm">{{
          emailError
        }}</span>

        <Input
          v-model="formData.password"
          type="password"
          placeholder="Password"
          class="bg-white/20 border-white/30 text-white placeholder:text-white/70"
        />

        <Button
          type="submit"
          class="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg shadow-md transition"
        >
          เข้าสู่ระบบ
        </Button>
      </form>
    </div>
  </div>
</template>
