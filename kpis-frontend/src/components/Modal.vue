<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

defineProps<{
  modelValue: boolean;
  title?: string;
  description?: string;
  width?: "sm" | "md" | "lg" | "xl" | string; // รองรับ preset + custom
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
const widthClass = (width?: string) => {
  switch (width) {
    case "sm":
      return "sm:max-w-[425px]";
    case "md":
      return "sm:max-w-[600px]";
    case "lg":
      return "sm:max-w-[800px]";
    case "xl":
      return "sm:max-w-[1000px]";
    default:
      return width ? `sm:max-w-[${width}]` : "sm:max-w-[425px]";
  }
};
</script>

<template>
  <Dialog :open="modelValue" @update:open="emit('update:modelValue', $event)">
    <DialogContent
      :class="widthClass(width)"
      class="bg-muted dark:bg-background"
    >
      <DialogHeader>
        <DialogTitle>{{ title || "Default Title" }}</DialogTitle>
        <DialogDescription>
          {{ description || "Default description..." }}
        </DialogDescription>
      </DialogHeader>
      <slot />
    </DialogContent>
  </Dialog>
</template>
