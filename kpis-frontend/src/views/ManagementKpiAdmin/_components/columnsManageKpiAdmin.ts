export interface KpiAdmin {
  id: number;
  title: string;
  description: string;
  targetValue: number;
  actualValue: number;
  status: "On Track" | "At Risk" | "Off Track";
  assignedUser: number;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  goalType: "increase" | "decrease";
  user?: {
    id: number;
    email?: string;
  };
}

import DataTableDropDownKpi from "@/views/ManagementKpiAdmin/_components/DataTableDropDownKpi.vue";
import Update_popover from "@/views/ManagementKpiAdmin/_components/Update_popover.vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

export function columnsManageKpiAdmin(users: any[]): ColumnDef<KpiAdmin>[] {
  return [
    {
      accessorKey: "title",
      header: () => h("div", { class: "text-left font-semibold" }, "หัวข้อ"),
      cell: ({ row }) => h("span", {}, row.getValue("title") as string),
    },
    {
      accessorKey: "description",
      header: () =>
        h("div", { class: "text-left font-semibold" }, "รายละเอียด"),
      cell: ({ row }) =>
        h(
          "span",
          {
            class: "whitespace-normal break-words min-w-xl",
          },
          row.getValue("description") as string
        ),
    },
    {
      accessorKey: "targetValue",
      header: () => h("div", { class: "text-right font-semibold" }, "เป้าหมาย"),
      cell: ({ row }) => {
        const value = Number(row.getValue("targetValue"));
        return h("div", { class: "text-right" }, value.toLocaleString());
      },
    },
    {
      accessorKey: "actualValue",
      header: () =>
        h("div", { class: "text-right font-semibold" }, "ค่าปัจจุบัน"),
      cell: ({ row }) => {
        const value = Number(row.getValue("actualValue"));
        // const role = row.original.
        return h(
          "div",
          {
            class: "text-right font-medium flex items-center justify-end gap-2",
          },
          [
            value.toLocaleString(), // ✅ text
            h(Update_popover, { kpi: row.original }), // ✅ component
          ]
        );
      },
    },
    {
      accessorKey: "goalType",
      header: () => h("div", { class: "text-right font-semibold" }, "เป้าหมาย"),
      cell: ({ row }) => {
        const value = row.getValue("goalType") as "increase" | "decrease";

        // แปลงค่าเป็นข้อความ/สัญลักษณ์
        const displayValue = value === "increase" ? "เพิ่มขึ้น 📈" : "ลดลง 📉";

        return h(
          "div",
          {
            class:
              "text-right font-medium flex items-center justify-end gap-2 cursor-pointer",
            onClick: () => console.log("goalType:", value, row.original),
          },
          displayValue
        );
      },
    },
    {
      accessorKey: "status",
      header: () => h("div", { class: "text-center font-semibold" }, "สถานะ"),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let colorClass = "text-gray-500";
        if (status === "On Track") colorClass = "text-green-600";
        else if (status === "At Risk") colorClass = "text-yellow-600";
        else if (status === "Off Track") colorClass = "text-red-600";

        return h(
          "div",
          { class: `text-center font-medium ${colorClass}` },
          status
        );
      },
    },
    {
      accessorKey: "assignedUser",
      header: () =>
        h("div", { class: "text-left font-semibold" }, "ผู้รับผิดชอบ"),
      cell: ({ row }) => {
        const user = row.original.user; // ดึงข้อมูล user จาก row.original
        return h("span", {}, user?.email || "-");
      },
    },
    {
      accessorKey: "startDate",
      header: () =>
        h("div", { class: "text-center font-semibold" }, "เริ่มต้น"),
      cell: ({ row }) => {
        const isoDate = row.getValue("startDate") as string;
        if (!isoDate) return h("span", {}, "-");

        const date = new Date(isoDate);
        const formatted = date.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short", // ถ้าอยากให้เต็มใช้ "long"
          year: "numeric",
        });
        return h("span", {}, formatted);
      },
    },
    {
      accessorKey: "endDate",
      header: () => h("div", { class: "text-center font-semibold" }, "สิ้นสุด"),
      cell: ({ row }) => {
        const isoDate = row.getValue("endDate") as string;
        if (!isoDate) return h("span", {}, "-");

        const date = new Date(isoDate);
        const formatted = date.toLocaleDateString("th-TH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
        return h("span", {}, formatted);
      },
    },
    {
      id: "actions",
      header: () => h("div", { class: "text-center font-semibold" }, "Action"),
      cell: ({ row }) => {
        console.log(users);
        return h(DataTableDropDownKpi, {
          kpi: row.original,
          users: users,
        });
      },
    },
  ];
}
