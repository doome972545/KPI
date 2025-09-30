export interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  role: string;
}

import Badge from "@/components/ui/badge/Badge.vue";
import DataTableDropDown from "@/views/ManagementUser/_components/DataTableDropDown.vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";

export const columnsManageUser: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: () => h("div", { class: "text-left font-semibold" }, "ชื่อผู้ใช้"),
    cell: ({ row }) => {
      const username = row.getValue("username") as string;
      return h("span", {}, username);
    },
  },
  {
    accessorKey: "email",
    header: () => h("div", { class: "text-left font-semibold" }, "อีเมล"),
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return h("span", {}, email);
    },
  },
  {
    accessorKey: "role",
    header: () =>
      h("div", { class: "text-left font-semibold" }, "สิทธิ์การใช้งาน"),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      // 🎨 Map role -> style
      const roleStyles: Record<string, any> = {
        Admin: {
          variant: "destructive",
          class:
            "px-3 py-1 rounded-full dark:text-red-200 bg-red-100 border border-red-400 text-red-700",
        },
        User: {
          variant: "secondary",
          class:
            "px-3 py-1 rounded-full dark:text-black bg-green-100 border border-green-400 text-green-700",
        },
      };

      // 📝 Map role -> custom text
      const roleText: Record<string, string> = {
        Admin: "ผู้ดูแลระบบ",
        User: "ผู้ใช้งาน",
        SuperAdmin: "บุคคลทั่วไป",
      };

      const props = role
        ? roleStyles[role] || {
            variant: "secondary",
            class: "px-3 py-1 rounded-full",
          }
        : {
            variant: "outline",
            class: "px-3 py-1 rounded-full text-gray-400 ",
          };

      return h(Badge, props, {
        default: () => roleText[role] || "ไม่มีสิทธิ์เข้าใช้งาน",
      });
    },
  },
  {
    id: "actions",
    header: () => h("div", { class: "text-right font-semibold   " }, "actions"),
    cell: ({ row }) => {
      const user = row.original;
      return h(
        "div",
        { class: "relative flex justify-end " },
        h(DataTableDropDown, { user })
      );
    },
  },
];
