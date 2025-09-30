import type { Role } from "@/views/ManagementUser/_components/DialogAddUser.vue";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AppState {
  loading: boolean;
  reload: boolean;
  roles: Role[];
  user: User | null; // ปรับให้สามารถเป็น null ได้
}

// โหลด user จาก localStorage
const storedUser = localStorage.getItem("user");
const parsedUser: User | null = storedUser ? JSON.parse(storedUser) : null;

const initialState: AppState = {
  loading: false,
  reload: false,
  roles: [],
  user: parsedUser,
};

export const AppSlice = createSlice({
  name: "AppSlice",
  initialState,
  reducers: {
    isLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    isReload: (state, action: PayloadAction<boolean>) => {
      state.reload = action.payload;
    },
    addRole: (state, action: PayloadAction<Role[]>) => {
      state.roles = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user"); // ลบ user ออกจาก localStorage ถ้าเป็น null
      }
    },
  },
});

export const { isLoading, isReload, addRole, setUser } = AppSlice.actions;
