// src/api/authApi.js
import axiosClient from "./axiosClient";

const authApi = {
  // ✅ Đăng nhập
  login: (email, password) =>
    axiosClient.post("/auth/login", { email, password }),

  // ✅ Đăng ký
  register: (name, email, password) =>
    axiosClient.post("/auth/register", { name, email, password }),

  // ✅ Lấy thông tin hồ sơ hiện tại
  profile: () => axiosClient.get("/auth/profile"),
};

export default authApi;
