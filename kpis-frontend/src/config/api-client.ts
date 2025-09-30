import axios from "axios";

import { HOST_BASE } from "./contants";
// import { decodeUser } from "@/slice/AuthSlice";

export const apiClient = axios.create({
  baseURL: HOST_BASE,
  withCredentials: true,
});
