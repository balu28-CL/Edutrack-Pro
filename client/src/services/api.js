import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api"
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