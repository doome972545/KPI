<script setup lang="ts">
import { computed } from "vue";
import type { KpiAdmin } from "@/views/ManagementKpiAdmin/_components/columnsManageKpiAdmin";

const props = defineProps<{ kpis: KpiAdmin[] }>();

const achievedCount = computed(() =>
  props.kpis.reduce((sum, k) => {
    if (k.status === "On Track") return sum + 1;
    if (k.status === "At Risk") return sum + 0.5;
    return sum;
  }, 0)
);

const totalKpis = computed(() => props.kpis.length);

const achievedPercent = computed(() =>
  totalKpis.value > 0 ? (achievedCount.value / totalKpis.value) * 100 : 0
);

// --- Pie Chart (Achieved %) ---
const pieSeries = computed(() => [
  achievedPercent.value,
  100 - achievedPercent.value,
]);

const pieOptions = {
  chart: { type: "pie", toolbar: { show: false } },
  labels: ["Achieved", "Not Achieved"],
  colors: ["#4ade80", "#f87171"],
  legend: { position: "bottom" },
  dataLabels: {
    formatter: (val: number) => `${val.toFixed(1)}%`,
  },
};
</script>

<template>
  <div class="rounded-xl bg-card/50 p-4 shadow-md border border-mute h-full">
    <h2 class="text-2xl font-bold mb-4">KPI Progress</h2>

    <div class="">
      <div>
        <apexchart
          type="pie"
          :options="pieOptions"
          :series="pieSeries"
          height="300"
        />
      </div>
    </div>
  </div>
</template>
