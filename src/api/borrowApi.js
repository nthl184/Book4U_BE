// src/api/borrowApi.js
import axiosClient from "./axiosClient";

const borrowApi = {
  // ✅ Lấy tất cả (admin)
  getAll: () => axiosClient.get("/borrow"),

  // ✅ Lấy borrow của user cụ thể (admin có thể dùng)
  getByUser: (userId) => axiosClient.get(`/borrow/user/${userId}`),

  // ✅ Lấy borrow của chính user đang đăng nhập (student)
  getMine: () => axiosClient.get("/borrow/me"),

  // ✅ Tạo borrow mới
  create: (userId, bookId) => axiosClient.post("/borrow", { userId, bookId }),

  // ✅ Các hành động
  approve: (id) => axiosClient.put(`/borrow/${id}/approve`),
  extend: (id) => axiosClient.put(`/borrow/${id}/extend`),
  markReturned: (id) => axiosClient.put(`/borrow/${id}/return`),

  // ✅ Xóa
  delete: (id) => axiosClient.delete(`/borrow/${id}`),

  // ✅ Sync
  syncAll: () => axiosClient.post("/borrow/sync"),
};

export default borrowApi;
