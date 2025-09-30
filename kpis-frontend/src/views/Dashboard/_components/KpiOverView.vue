<script setup lang="ts">
import { computed } from "vue";
import type { KpiAdmin } from "@/views/ManagementKpiAdmin/_components/columnsManageKpiAdmin";

const props = defineProps<{
  kpis: KpiAdmin[];
  users: { id: number; username: string }[];
}>();

// KPI Summary (On Track, At Risk, Off Track)
const kpiSummary = computed(() => {
  const summary: Record<string, number> = {
    "On Track": 0,
    "At Risk": 0,
    "Off Track": 0,
  };

  props.kpis.forEach((kpi) => {
    summary[kpi.status] = (summary[kpi.status] ?? 0) + 1;
  });

  return Object.entries(summary).map(([label, value]) => ({ label, value }));
});

const totalKpi = computed(() => props.kpis.length);

// ✅ ใช้เฉพาะค่า 3 status
const series = computed(() => [
  kpiSummary.value.find((k) => k.label === "On Track")?.value ?? 0,
  kpiSummary.value.find((k) => k.label === "At Risk")?.value ?? 0,
  kpiSummary.value.find((k) => k.label === "Off Track")?.value ?? 0,
]);

const chartOptions = {
  chart: { type: "donut", toolbar: { show: false } },
  plotOptions: { pie: { donut: { size: "60%" } } },
  labels: ["On Track", "At Risk", "Off Track"],
  colors: ["#4ade80", "#facc15", "#f87171"], // เขียว, เหลือง, แดง
  legend: { position: "bottom" },
};
</script>

<template>
  <div
    class="rounded-xl bg-card/50 max-h-[400px] p-4 shadow-md border border-muted"
  >
    <h1 class="text-2xl font-bold text-muted-foreground mb-6">KPI Overview</h1>

    <div class="grid grid-cols-3 gap-4">
      <!-- Donut Chart -->
      <div class="aspect-video w-full relative flex justify-end">
        <apexchart
          type="donut"
          :series="series"
          :options="chartOptions"
          height="100%"
          class="absolute inset-0"
        />
        <div
          class="absolute inset-0 -translate-y-5 flex flex-col items-center justify-center pointer-events-none"
        >
          <div class="text-center">
            <div class="text-2xl font-bold">{{ totalKpi }}</div>
            <div class="text-sm text-gray-500">KPI ทั้งหมด</div>
          </div>
        </div>
      </div>

      <!-- KPI Summary -->
      <div class="mt-4 grid grid-cols-4 gap-2 text-center col-span-2">
        <div
          v-for="(item, index) in kpiSummary"
          :key="index"
          class="border bg-accent flex flex-col justify-center items-center border-accent-foreground/20 rounded-md px-2 py-2"
        >
          <div class="text-2xl font-bold">{{ item.value }}</div>
          <div class="text-2xl text-mute">
            {{ item.label === null ? "test" : item.label }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
