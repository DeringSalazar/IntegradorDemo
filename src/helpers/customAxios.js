import axios from "axios";

const BASE_URL = "https://backendapi-production-bf1d.up.railway.app/api";

const customAxios = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para agregar token automáticamente
customAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // o sessionStorage, o cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default customAxios;
