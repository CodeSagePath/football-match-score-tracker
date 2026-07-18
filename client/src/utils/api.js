import axios from "axios";

export const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    }
}); 

// Dynamically attach X-Admin-Key to all requests
API.interceptors.request.use((config) => {
    const key = localStorage.getItem("ADMIN_KEY");
    if (key) {
        config.headers["X-Admin-Key"] = key;
    }
    return config;
});

export default API;
