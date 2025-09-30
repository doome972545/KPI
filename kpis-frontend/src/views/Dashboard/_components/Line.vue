<script setup lang="ts">
import { computed } from "vue";

export interface KpiUpdate {
  id: number;
  kpiId: number;
  updatedValue: string;
  updatedAt: string;
  comment: string;
  kpi: {
    id: number;
    title: string;
    goalType: string;
    status: string | null;
  };
  user: {
    id: number;
    email: string;
  };
}

const props = defineProps<{
  kpisUpdate: KpiUpdate[];
}>();

const chartSeries = computed(() => {
  const kpiIds = Array.from(new Set(props.kpisUpdate.map((k) => k.kpiId)));

  return kpiIds.map((id) => {
    const kpiData = props.kpisUpdate
      .filter((k) => k.kpiId === id)
      .sort(
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      )
      .map((k) => ({
        x: new Date(k.updatedAt).getTime(),
        y: Number(k.updatedValue),
        comment: k.comment ?? "-",
      }));

    return {
      name:
        props.kpisUpdate.find((k) => k.kpiId === id)?.kpi.title ?? `KPI ${id}`,
      data: kpiData,
    };
  });
});

const chartOptions = computed(() => ({
  chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false } },
  stroke: { curve: "smooth" },
  xaxis: { type: "datetime", title: { text: "Time" } },
  yaxis: { title: { text: "Value" } },
  tooltip: {
    shared: true,
    intersect: false,
    custom: ({ series, seriesIndex, dataPointIndex, w }: any) => {
      const comment = w.config.series[seriesIndex].data[dataPointIndex].comment;
      const value = series[seriesIndex][dataPointIndex];
      const date = new Date(w.globals.labels[dataPointIndex]).toLocaleString();
      return `<div>
                <strong>${w.config.series[seriesIndex].name}</strong><br/>
                Date: ${date}<br/>
                Value: ${value}<br/>
                Comment: ${comment}
              </div>`;
    },
  },
}));
</script>

<template>
  <div class="rounded-xl bg-card/50 h-full p-4 shadow-md border border-muted">
    <h2 class="text-lg font-semibold mb-4">KPI Trends Over Time</h2>
    <apexchart
      type="line"
      :series="chartSeries"
      :options="chartOptions"
      height="350"
    />
  </div>
</template>
