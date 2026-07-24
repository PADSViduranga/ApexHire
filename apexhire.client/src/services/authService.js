import axiosClient from "../api/axiosClient";

const authService = {
    async login(email, password) {
        const response = await axiosClient.post(
            "/api/auth/login",
            {
                email: email.trim(),
                password,
            }
        );

        return response.data;
    },

    async register(payload) {
        const response = await axiosClient.post(
            "/api/auth/register",
            {
                fullName: payload.fullName.trim(),
                email: payload.email.trim(),
                password: payload.password,
                confirmPassword:
                    payload.confirmPassword,
            }
        );

        return response.data;
    },
};

export default authService;