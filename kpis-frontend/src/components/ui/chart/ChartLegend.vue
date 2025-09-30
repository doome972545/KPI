<script setup lang="ts">
import type { BulletLegendItemInterface } from "@unovis/ts";
import { BulletLegend } from "@unovis/ts";
import { VisBulletLegend } from "@unovis/vue";
import { nextTick, onMounted, ref, watch } from "vue";
import { buttonVariants } from "@/components/ui/button";

// กำหนด default ให้ props.items เป็น array ว่าง
const props = withDefaults(
  defineProps<{ items?: BulletLegendItemInterface[] }>(),
  {
    items: () => [],
  }
);

// reactive items ใช้แทน props.items
const items = ref<BulletLegendItemInterface[]>(props.items || []);

// sync items กับ props ถ้ามีการเปลี่ยน
watch(
  () => props.items,
  (newItems) => {
    items.value = newItems || [];
  }
);

const emits = defineEmits<{
  legendItemClick: [d: BulletLegendItemInterface, i: number];
  "update:items": [payload: BulletLegendItemInterface[]];
}>();

const elRef = ref<HTMLElement>();

function keepStyling() {
  const selector = `.${BulletLegend.selectors.item}`;
  nextTick(() => {
    const elements = elRef.value?.querySelectorAll(selector);
    const classes = buttonVariants({ variant: "ghost", size: "lg" }).split(" ");
    elements?.forEach((el) =>
      el.classList.add(...classes, "!inline-flex", "!mr-2")
    );
  });
}

onMounted(() => {
  keepStyling();
});

function onLegendItemClick(d: BulletLegendItemInterface, i: number) {
  const currentItem = items.value[i];
  if (!currentItem) return; // ป้องกัน undefined

  emits("legendItemClick", d, i);

  const isBulletActive = !currentItem.inactive;
  const isFilterApplied = items.value.some((item) => item?.inactive);

  if (isFilterApplied && isBulletActive) {
    // reset filter
    items.value = items.value.map((item) => ({ ...item, inactive: false }));
  } else {
    // apply selection, set other item as inactive
    items.value = items.value.map((item) =>
      item.name === d.name
        ? { ...d, inactive: false }
        : { ...item, inactive: true }
    );
  }

  emits("update:items", items.value);
  keepStyling();
}
</script>

<template>
  <div
    ref="elRef"
    class="w-max"
    :style="{ '--vis-legend-bullet-size': '16px' }"
  >
    <VisBulletLegend :items="items" :on-legend-item-click="onLegendItemClick" />
  </div>
</template>
