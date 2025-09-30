<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { KpiAdmin } from "@/views/ManagementKpiAdmin/_components/columnsManageKpiAdmin";
import { toTypedSchema } from "@vee-validate/zod";
import { ChevronsUpDown } from "lucide-vue-next";
import { useForm } from "vee-validate";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z from "zod";
import { store } from "@/redux/store";
import { updatedValueKpi } from "@/api/kpi";
import { toast } from "vue-sonner";

const props = defineProps<{
  kpi: KpiAdmin;
}>();

const role = store.getState().app.user?.role;

const formSchema = toTypedSchema(
  z.object({
    kpi_id: z.number().optional(),
    updated_value: z.coerce.number().optional(),
    comment: z.string().optional(),
  })
);

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    kpi_id: props.kpi.id,
    updated_value: props.kpi.actualValue ?? 0,
    comment: "",
  },
});

const onSubmit = handleSubmit(async (values) => {
  try {
    const updatePromise = updatedValueKpi({
      kpi_id: values.kpi_id!,
      updated_value: values.updated_value!,
      comment: values.comment || "",
    });

    toast.promise(updatePromise, {
      loading: "กำลังอัพเดท...",
      success: () => {
        return "อัพเดทสำเร็จ";
      },
      error: (err: any) => err || "เกิดข้อผิดพลาด",
    });

    await updatePromise; // รอให้ Promise เสร็จจริง
    resetForm();
  } catch (error) {
    console.error("Failed to update KPI:", error);
  }
});
</script>

<template>
  <Popover v-if="role === 'User'">
    <PopoverTrigger as-child>
      <ChevronsUpDown class="cursor-pointer" />
    </PopoverTrigger>
    <PopoverContent class="w-96">
      <form @submit.prevent="onSubmit">
        <div class="grid gap-4">
          <div class="space-y-2">
            <h4 class="font-medium leading-none">อัพเดทข้อมูล</h4>
            <p class="text-sm text-muted-foreground">กำหนดค่าตัวชี้วัด</p>
          </div>

          <!-- updated_value -->
          <FormField name="updated_value" v-slot="{ field }">
            <FormItem>
              <FormLabel>ค่าที่ต้องการอัพเดท</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="ค่าที่ต้องการอัพเดท"
                  class="h-8"
                  v-bind="field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- comment -->
          <FormField name="comment" v-slot="{ field }">
            <FormItem>
              <FormLabel>คอมเมนท์</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="คอมเมนท์"
                  class="h-8"
                  v-bind="field"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <Button type="submit" class="ml-auto"> บันทึกการเปลี่ยนแปลง </Button>
        </div>
      </form>
    </PopoverContent>
  </Popover>
</template>
