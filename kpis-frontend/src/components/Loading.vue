<script setup lang="ts">
defineProps<{
  fullscreen?: boolean; // true = ครอบทั้งหน้าจอ, false = ครอบ parent div
  text?: string; // ข้อความแสดงขณะโหลด
}>();
</script>

<template>
  <div
    :class="[
      'flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-50',
      fullscreen ? 'fixed inset-0' : 'absolute inset-0',
    ]"
  >
    <div class="flex items-center gap-2">
      <div
        style="border-top-color: transparent"
        class="w-8 h-8 border-4 border-primary rounded-full animate-spin"
      ></div>
      <p v-if="text" class="ml-2">{{ text }}</p>
    </div>
  </div>
</template>
