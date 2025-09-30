<script setup lang="ts">
import { ref, watch } from "vue";
import { MoreHorizontal } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { KpiAdmin } from "@/views/ManagementKpiAdmin/_components/columnsManageKpiAdmin";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toTypedSchema } from "@vee-validate/zod";
import z from "zod";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { deleteKpiId, updateKpi } from "@/api/kpi";
import { store } from "@/redux/store";

const props = defineProps<{
  kpi: KpiAdmin;
  users: { id: string; email: string }[];
}>();
const role = store.getState().app.user?.role;
const formSchema = toTypedSchema(
  z.object({
    id: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    targetValue: z.coerce.number().optional(),
    assignedUser: z.number().optional(),
    startDate: z.string(),
    endDate: z.string(),
  })
);

// ✅ ใช้ useForm
const { handleSubmit, resetForm, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    ...props.kpi, // preload ค่าเดิมเข้ามา
    assignedUser: props.kpi.user?.id ?? 0,
  },
});

const editDialogOpen = ref(false);

const onSubmit = handleSubmit(async (values) => {
  console.log(values);
  try {
    const payload: KpiAdmin = {
      ...props.kpi, // เอาค่าเดิมมาก่อน
      ...values, // ทับด้วยค่าที่แก้ไข
    };

    await updateKpi(payload);
    editDialogOpen.value = false;
    resetForm();
  } catch (error) {
    console.error("Failed to update KPI:", error);
  }
});

const viewDialogOpen = ref(false);

// คอยอัพเดทค่าใน form เมื่อกดเปิด edit
watch(
  () => editDialogOpen.value,
  (isOpen) => {
    if (isOpen) {
      resetForm({
        values: {
          ...props.kpi,
          assignedUser: props.kpi.user?.id ?? 0,
        },
      });
    }
  }
);

// ถ้า props.kpi เปลี่ยนจากภายนอก (เช่นตอนกด view ก่อนแล้วค่อยมา edit)
watch(
  () => props.kpi,
  (newVal) => {
    resetForm({
      values: {
        ...newVal,
        assignedUser: newVal.user?.id ?? 0,
      },
    });
  }
);

function viewDetails() {
  viewDialogOpen.value = true;
}

function formatDate(isoDate: string) {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function deleteKpi() {
  // Placeholder function for deleting KPI
  try {
    // await deleteKpiApi(props.kpi.id); // สมมติว่ามีฟังก์ชันนี้
    await deleteKpiId(props.kpi.id);

  } catch (error) {
    console.error("Failed to delete KPI:", error);
  }
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="ghost" class="w-8 h-8 p-0">
        <MoreHorizontal class="w-4 h-4" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Action</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="viewDetails">รายละเอียด</DropdownMenuItem>
      <DropdownMenuItem @click="editDialogOpen = true">
        แก้ไขข้อมูล
      </DropdownMenuItem>
      <DropdownMenuItem class="bg-red-500 text-white" @click="deleteKpi"
        >ลบ Kpi</DropdownMenuItem
      >
    </DropdownMenuContent>
  </DropdownMenu>
  <!-- ✅ ฟอร์มจริง -->
  <Dialog v-model:open="editDialogOpen">
    <DialogContent class="sm:max-w-[425px]">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Edit KPI</DialogTitle>
          <DialogDescription>
            แก้ไข Title, Description, Target Value และ Assigned User
          </DialogDescription>
        </DialogHeader>

        <div class="flex flex-col gap-4 mt-2">
          <!-- ✅ Title -->
          <FormField name="title" v-slot="{ field }">
            <FormItem>
              <FormLabel>หัวข้อ</FormLabel>
              <FormControl>
                <Input
                  :model-value="values.title"
                  type="text"
                  placeholder="ชื่อหัวข้อ"
                  v-bind="field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- ✅ Description -->
          <FormField name="description" v-slot="{ field }">
            <FormItem>
              <FormLabel> รายละเอียด</FormLabel>
              <FormControl>
                <Input
                  :model-value="values.description"
                  type="text"
                  placeholder="รายละเอียด"
                  v-bind="field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- ✅ Target Value -->
          <FormField name="targetValue" v-slot="{ field }">
            <FormItem>
              <FormLabel>เป้าหมาย</FormLabel>
              <FormControl>
                <Input
                  :model-value="values.targetValue"
                  type="number"
                  placeholder="ค่าที่ต้องการ"
                  @update:model-value="(val) => field.onChange(Number(val))"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- ✅ Assigned User -->
          <FormField
            name="assignedUser"
            v-slot="{ field }"
            v-if="role !== 'User'"
          >
            <FormItem>
              <FormLabel>ผู้รับผิดชอบ</FormLabel>
              <FormControl>
                <Select
                  :model-value="values.assignedUser"
                  @update:model-value="(val) => field.onChange(Number(val))"
                >
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="เลือกผู้รับผิดชอบ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      v-for="user in props.users"
                      :key="user.id"
                      :value="user.id"
                    >
                      {{ user.email }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <DialogFooter class="mt-4">
          <Button type="submit">บันทึก</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>

  <!-- Dialog แสดงรายละเอียด -->
  <Dialog v-model:open="viewDialogOpen">
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>รายละเอียด</DialogTitle>
        <DialogDescription>รายละเอียดของข้อมูล</DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-2">
        <!-- <div><strong>ID:</strong> {{ props.kpi.id }}</div> -->
        <div><strong>หัวข้อ:</strong> {{ props.kpi.title }}</div>
        <div><strong> รายละเอียด:</strong> {{ props.kpi.description }}</div>
        <div><strong>เป้าหมาย:</strong> {{ props.kpi.targetValue }}</div>
        <div><strong>ค่าปัจจุบัน:</strong> {{ props.kpi.actualValue }}</div>
        <div><strong>ประเภทเป้าหมาย:</strong> {{ props.kpi.goalType }}</div>
        <div><strong>สถานะ:</strong> {{ props.kpi.status }}</div>
        <div><strong>ผู้รับผิดชอบ:</strong> {{ props.kpi.user?.email }}</div>
        <div>
          <strong>เริ่มต้น:</strong> {{ formatDate(props.kpi.startDate) }}
        </div>
        <div><strong>สิ้นสุด:</strong> {{ formatDate(props.kpi.endDate) }}</div>
      </div>
      <DialogFooter class="mt-4">
        <Button @click="viewDialogOpen = false">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
