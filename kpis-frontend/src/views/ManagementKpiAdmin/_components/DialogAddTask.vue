<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { toTypedSchema } from "@vee-validate/zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-vue-next";
import { useForm } from "vee-validate";
import * as z from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  DateFormatter,
  getLocalTimeZone,
  parseDate,
} from "@internationalized/date";
import { computed, ref } from "vue";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createKpis, type CreateKpiDto } from "@/api/kpi";
import { toast } from "vue-sonner";
interface User {
  id: number;
  username: string;
  role: string;
  email: string;
  roleId: number;
}
const dialogOpen = ref(false); // state เปิด/ปิด dialog

const props = defineProps<{
  users: User[];
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  } | null;
}>();

const formSchema = toTypedSchema(
  z.object({
    id: z.coerce.number().optional(),
    title: z
      .string({
        required_error: "กรุณากรอกชื่อหัวข้อ",
      })
      .min(1, "กรุณากรอกชื่อหัวข้อ"),
    description: z
      .string({
        required_error: "กรุณากรอกรายละเอียด",
      })
      .min(1, "กรุณากรอกรายละเอียด"),
    targetValue: z.coerce
      .number({
        required_error: "กรุณากรอกเป้าหมาย",
        invalid_type_error: "เป้าหมายต้องเป็นตัวเลข",
      })
      .min(1, "เป้าหมายต้องมากกว่า 0"),
    goalType: z.enum(["increase", "decrease"], {
      required_error: "กรุณาเลือกประเภทเป้าหมาย",
    }),
    startDate: z.string({
      required_error: "กรุณาเลือกวันที่เริ่มงาน",
      invalid_type_error: "ระบุเริ่มงานไม่ถูกค้อง",
    }),
    endDate: z.string({
      required_error: "กรุณาเลือกวันที่สิ้นสุดงาน",
      invalid_type_error: "ระบุสิ้นสุดงานไม่ถูกค้อง",
    }),
  })
);

const { handleSubmit, resetForm, setFieldValue, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    id: props.user?.role === "User" ? props.user.id : undefined,
  },
});
const df = new DateFormatter("th", {
  dateStyle: "long",
});

const startDate = computed({
  get: () => (values.startDate ? parseDate(values.startDate) : undefined),
  set: (val) => val,
});
const endDate = computed({
  get: () => (values.endDate ? parseDate(values.endDate) : undefined),
  set: (val) => val,
});

const onSubmit = handleSubmit(async (values: CreateKpiDto) => {
  try {
    const kpi = await createKpis(values);
    resetForm();
    console.log("บันทึกสำเร็จ ✅", kpi);
    dialogOpen.value = false; // ✅ ปิด Dialog
  } catch (error: any) {
    toast.error(error);
    return;
  }
});
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogTrigger as-child>
      <Button variant="default"> เพิ่มงาน </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] h-[80%]">
      <DialogHeader>
        <DialogTitle>เพิ่มงาน</DialogTitle>
        <DialogDescription> ระบุรายละเอียดการเพิ่มงาน </DialogDescription>
      </DialogHeader>

      <form
        @submit.prevent="onSubmit"
        class="flex flex-col gap-5 overflow-y-auto"
      >
        <!-- หัวข้อ -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">ชื่อหัวข้อ</label>
          <FormField name="title" v-slot="{ field }">
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="ชื่อหัวข้อ" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- รายละเอียด -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">รายละเอียด</label>
          <FormField name="description" v-slot="{ field }">
            <FormItem>
              <FormControl>
                <Input type="text" placeholder="รายละเอียดงาน" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- เป้าหมาย -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">เป้าหมาย</label>
          <FormField name="targetValue" v-slot="{ field }">
            <FormItem>
              <FormControl>
                <Input type="number" placeholder="เป้าหมาย" v-bind="field" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- ผู้รับผิดชอบ -->
        <div v-if="user?.role === 'Admin'" class="flex flex-col gap-2">
          <label class="text-sm font-medium">ผู้รับผิดชอบ</label>
          <FormField name="id">
            <FormItem class="flex flex-col">
              <Popover>
                <PopoverTrigger as-child>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      :class="
                        cn(
                          'w-full justify-between',
                          !values.id && 'text-muted-foreground'
                        )
                      "
                    >
                      {{
                        values.id
                          ? props.users.find((user) => user.id === values.id)
                              ?.email
                          : "เลือกผู้รับผิดชอบ..."
                      }}
                      <ChevronsUpDown
                        class="ml-2 h-4 w-4 shrink-0 opacity-50"
                      />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="ค้นหาผู้รับผิดชอบ..." />
                    <CommandEmpty>ไม่พบข้อมูล</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          v-for="user in props.users"
                          :key="user.id"
                          :value="user.username"
                          @select="
                            () => {
                              setFieldValue('id', user.id);
                            }
                          "
                        >
                          {{ user.email }}
                          <Check
                            :class="
                              cn(
                                'ml-auto h-4 w-4',
                                user.id === values.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )
                            "
                          />
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>

        <!-- เริ่มงาน -->
        <div class="flex gap-2">
          <FormField name="startDate">
            <FormItem class="flex flex-col w-full">
              <label class="text-sm font-medium">เริ่มงาน</label>
              <Popover>
                <PopoverTrigger as-child>
                  <FormControl>
                    <Button
                      variant="outline"
                      :class="
                        cn(
                          'w-full justify-start text-left font-normal',
                          !values.startDate && 'text-muted-foreground'
                        )
                      "
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{
                        values.startDate
                          ? df.format(
                              parseDate(values.startDate).toDate(
                                getLocalTimeZone()
                              )
                            )
                          : "เลือกวันที่เริ่มงาน"
                      }}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    locale="th"
                    :model-value="startDate"
                    @update:model-value="
                      (val) => setFieldValue('startDate', val?.toString())
                    "
                    initial-focus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </FormField>

          <!-- สิ้นสุดงาน -->
          <FormField name="endDate">
            <FormItem class="flex flex-col w-full">
              <label class="text-sm font-medium">สิ้นสุดงาน</label>
              <Popover>
                <PopoverTrigger as-child>
                  <FormControl>
                    <Button
                      variant="outline"
                      :class="
                        cn(
                          'w-full justify-start text-left font-normal',
                          !values.endDate && 'text-muted-foreground'
                        )
                      "
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{
                        values.endDate
                          ? df.format(
                              parseDate(values.endDate).toDate(
                                getLocalTimeZone()
                              )
                            )
                          : "เลือกวันที่สิ้นสุดงาน"
                      }}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent class="w-auto p-0">
                  <Calendar
                    locale="th"
                    :model-value="endDate"
                    @update:model-value="
                      (val) => setFieldValue('endDate', val?.toString())
                    "
                    initial-focus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <!-- ประเภทเป้าหมาย -->
        <div class="flex flex-col gap-2">
          <label class="text-sm font-medium">ประเภทเป้าหมาย</label>
          <FormField name="goalType" v-slot="{ field }">
            <FormItem>
              <Select v-bind="field">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="เลือกประเภทเป้าหมาย" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>เลือกประเภทเป้าหมาย</SelectLabel>
                    <SelectItem value="increase">
                      เพิ่มขึ้น (Higher is better)
                    </SelectItem>
                    <SelectItem value="decrease">
                      ลดลง (Lower is better)
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <DialogFooter>
          <!-- ✅ ใช้ submit อย่างเดียว -->
          <Button type="submit"> บันทึก </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
