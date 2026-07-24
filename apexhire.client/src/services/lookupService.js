import axiosClient from "../api/axiosClient";

const lookupService = {

    async getOrganizations() {

        const response =
            await axiosClient.get(
                "/api/lookups/organizations"
            );

        return response.data;

    },

    async getDepartments(id) {

        const response =
            await axiosClient.get(
                `/api/lookups/departments/${id}`
            );

        return response.data;

    }

};

export default lookupService;