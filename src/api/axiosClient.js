// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api", // backend port 5000
  headers: { "Content-Type": "application/json" },
});

// ✅ Tự động gắn token JWT nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ✅ (Tuỳ chọn) Log API khi chạy dev
if (import.meta.env.MODE === "development") {
  axiosClient.interceptors.response.use((res) => {
    console.log("🔁 API:", res.config.url, res.status);
    return res;
  });
}

export default axiosClient;
