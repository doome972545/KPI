<script setup lang="ts">
import type { SidebarProps } from "@/components/ui/sidebar";

import VersionSwitcher from "@/components/VersionSwitcher.vue";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import SearchForm from "@/components/SearchForm.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";
import { routes as allRoutes } from "@/router";
import NavUser from "@/components/NavUser.vue";
import { store } from "@/redux/store";
const props = defineProps<SidebarProps>();
const route = useRoute();

// This is sample data.
// สร้าง accessibleRoutes พร้อม isActive
// แทนที่จะเอามาจาก store หรือ backend
const users = store.getState().app.user;

const accessibleRoutes = computed(() => {
  return allRoutes.map((r) => {
    if (!r.children) return r;

    const filteredChildren = r.children
      .filter((child) => {
        const meta = child.meta || {};
        if (!meta.role) return meta.isShow !== false;
        if (!users?.role) return false;

        const hasRole = Array.isArray(meta.role)
          ? meta.role.includes(users?.role)
          : meta.role === users?.role;

        return hasRole && meta.isShow !== false;
      })
      .map((child) => ({
        ...child,
        isActive: route.path === `${child.path}`, // เพิ่ม isActive
      }));

    return { ...r, children: filteredChildren };
  });
});

const data = {
  user: {
    username: users?.username || "",
    email: users?.email || "",
  },
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
};
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <VersionSwitcher />
      <SearchForm />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="item in accessibleRoutes" :key="item.name">
        <!-- <SidebarGroupLabel>{{ item.name }}</SidebarGroupLabel> -->
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem
              v-for="childItem in item.children"
              :key="childItem.name"
            >
              <SidebarMenuButton
                variant="default"
                as-child
                :is-active="childItem.isActive"
              >
                <a :href="`${childItem.path}`">{{ childItem.name }}</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
