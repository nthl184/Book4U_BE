import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api", // thay bằng URL backend của bạn
});

export default api;
