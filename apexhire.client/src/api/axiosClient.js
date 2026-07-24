import axios from "axios";

const axiosClient = axios.create({
    baseURL: "http://localhost:5188"
});

axiosClient.interceptors.request.use(
    config => {
        const token =
            localStorage.getItem(
                "apexhire_token"
            );

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },
    error => Promise.reject(error)
);

export default axiosClient;