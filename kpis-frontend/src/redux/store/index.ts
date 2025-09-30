import { AppSlice } from "@/redux/slice/appSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    app: AppSlice.reducer,
  },
});
