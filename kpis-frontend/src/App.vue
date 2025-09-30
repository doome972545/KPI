<script setup lang="ts">
import Loading from "@/components/Loading.vue";
import { store } from "@/redux/store";
import { useColorMode } from "@vueuse/core";
import { ref } from "vue";
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";

useColorMode();
const loading = ref(false);

store.subscribe(() => {
  const state = store.getState();
  loading.value = state.app.loading;
});
</script>

<template>
  <Loading fullscreen text="กำลังโหลด..." v-if="loading" />
  <router-view />
  <Toaster position="bottom-right" rich-colors />
</template>
