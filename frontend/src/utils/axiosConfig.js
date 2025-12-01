import axios from "axios";

const api = axios.create({
  baseURL: "https://storeratingapp-s4yi.onrender.com/api",
});

// Attach JWT automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
