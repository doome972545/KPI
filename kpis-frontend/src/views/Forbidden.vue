<!-- src/views/Forbidden.vue -->
<template>
  <div class="flex flex-col items-center justify-center h-screen text-center">
    <h1 class="text-6xl font-bold text-red-600">403</h1>
    <p class="text-xl mt-4">คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
    <router-link
      to="/dashboard"
      class="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
    >
      กลับไปหน้า Dashboard
    </router-link>
  </div>
</template>
