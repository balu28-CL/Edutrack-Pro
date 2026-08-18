import axios from "axios";

const API = axios.create({
    baseURL: "https://edutrack-pro-backend.onrender.com/api"
});

API.interceptors.request.use(
    (config) => {

        // Get token from sessionStorage
        const token = sessionStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default API;