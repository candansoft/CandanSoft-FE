// src/api/api.ts
import axios from "axios";
import { NAVIGATE_PATHS } from "../constants/Paths";

const BaseApiAxios = axios.create({
    baseURL: "/my-company", // BE base URL'in
    headers: { "Content-Type": "application/json" },
});

// 🔒 Request interceptor — her isteğe JWT token'ı ekle
BaseApiAxios.interceptors.request.use(
    (config) => {
        const jwtToken = localStorage.getItem("jwtToken");
        if (jwtToken) {
            config.headers.Authorization = `Bearer ${jwtToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🚨 Response interceptor — örneğin token süresi dolduysa logout gibi işlemler
BaseApiAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 ||
            error.response?.status === 403
        ) {
            console.warn("Yetkisiz erişim — token süresi dolmuş olabilir.");
            localStorage.clear();
            window.location.href = NAVIGATE_PATHS.LOGIN;
        }
        return Promise.reject(error);
    }
);

export default BaseApiAxios;
