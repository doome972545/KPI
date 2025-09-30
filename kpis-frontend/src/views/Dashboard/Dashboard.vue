<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import KpiOverView from "@/views/Dashboard/_components/KpiOverView.vue";
import Bar from "@/views/Dashboard/_components/Bar.vue";
import type { KpiAdmin } from "@/views/ManagementKpiAdmin/_components/columnsManageKpiAdmin";
import { getDashboard } from "@/api/kpi";
import type { User } from "@/views/ManagementUser/_components/columnsManageUser";
import Line, { type KpiUpdate } from "@/views/Dashboard/_components/Line.vue";

// --- Users ---
const users = ref<User[]>([]);
const kpis = ref<KpiAdmin[]>([]);
const kpisUpdate = ref<KpiUpdate[]>([]);

async function getAllDashboard(): Promise<void> {
  try {
    const response = await getDashboard(); // fetch from backend API
    // response.data = { kpis: KpiAdmin[], users: User[] }
    console.log(response);
    if (response) {
      kpis.value = (response.kpis ?? []).map((kpi: any) => ({
        ...kpi,
        targetValue: Number(kpi.targetValue),
        actualValue: Number(kpi.actualValue),
      }));
      kpisUpdate.value = response.kpiUpdate ?? [];
      users.value = response.users ?? [];
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
  }
}
onMounted(async () => {
  await getAllDashboard();
});
const selectedUser = ref("");
const selectedStatus = ref("");
const filteredKpis = computed(() => {
  return kpis.value.filter((kpi) => {
    const userMatch = selectedUser.value
      ? users.value.find((u) => u.id === kpi.assignedUser)?.email ===
        selectedUser.value
      : true;
    const statusMatch = selectedStatus.value
      ? kpi.status === selectedStatus.value
      : true;
    return userMatch && statusMatch;
  });
});

const userOptions = computed(() => users.value.map((u) => u.email));
const statusOptions = ["On Track", "At Risk", "Off Track"];
console.log(kpisUpdate.value);
</script>

<template>
  <div class="flex flex-col gap-4 p-4 pt-0">
    <!-- Filter -->
    <div class="flex gap-4">
      <div>
        <label class="block text-sm font-medium">User</label>
        <select v-model="selectedUser" class="border rounded-md p-1">
          <option value="">All</option>
          <option v-for="u in userOptions" :key="u" :value="u">{{ u }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium">Status</label>
        <select v-model="selectedStatus" class="border rounded-md p-1">
          <option value="">All</option>
          <option v-for="s in statusOptions" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
      </div>
    </div>

    <!-- KPI Overview -->
    <KpiOverView :kpis="filteredKpis" :users="users" />

    <!-- Other charts -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <!-- Bar Chart -->
      <div class="md:col-span-1">
        <Bar :kpis="kpis" />
      </div>
      <div class="md:col-span-3">
        <Line :kpisUpdate="kpisUpdate" />
      </div>
    </div>
  </div>
</template>
