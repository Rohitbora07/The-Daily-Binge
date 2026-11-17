import axios from "axios";
import userAuthStore from "../store/authStore";

const rawUrl = import.meta.env.VITE_BACKEND_URL || "";
const backendUrl = rawUrl.replace(/\/+$/, "");

const api = axios.create({
    baseURL: backendUrl ? `${backendUrl}/api` : "/api",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = userAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;