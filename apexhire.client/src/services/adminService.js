import axiosClient from "../api/axiosClient";

function unwrapResponse(response) {
    return response?.data?.data ?? response?.data;
}

const adminService = {

    /*
     * =====================================================
     * DASHBOARD
     * =====================================================
     */

    async getDashboardData() {
        const response = await axiosClient.get(
            "/api/admin/dashboard"
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * USERS
     * =====================================================
     */

    async getUsers(params = {}) {
        const response = await axiosClient.get(
            "/api/admin/users",
            { params }
        );

        return unwrapResponse(response);
    },

    async getUserById(userId) {
        const response = await axiosClient.get(
            `/api/admin/users/${userId}`
        );

        return unwrapResponse(response);
    },

    async createUser(data) {
        const response = await axiosClient.post(
            "/api/admin/users",
            data
        );

        return unwrapResponse(response);
    },

    async updateUser(userId, data) {
        const response = await axiosClient.put(
            `/api/admin/users/${userId}`,
            data
        );

        return unwrapResponse(response);
    },

    async updateUserRole(userId, role) {
        const response = await axiosClient.put(
            `/api/admin/users/${userId}/role`,
            { role }
        );

        return unwrapResponse(response);
    },

    async updateUserStatus(userId, isActive) {
        const response = await axiosClient.put(
            `/api/admin/users/${userId}/status`,
            { isActive }
        );

        return unwrapResponse(response);
    },

    async resetUserPassword(userId, newPassword) {
        const response = await axiosClient.put(
            `/api/admin/users/${userId}/reset-password`,
            { newPassword }
        );

        return unwrapResponse(response);
    },

    async deleteUser(userId) {
        const response = await axiosClient.delete(
            `/api/admin/users/${userId}`
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * ORGANIZATIONS
     * =====================================================
     */

    async getOrganizations() {
        const response = await axiosClient.get(
            "/api/admin/organizations"
        );

        return unwrapResponse(response);
    },

    async createOrganization(data) {
        const response = await axiosClient.post(
            "/api/admin/organizations",
            data
        );

        return unwrapResponse(response);
    },

    async updateOrganization(id, data) {
        const response = await axiosClient.put(
            `/api/admin/organizations/${id}`,
            data
        );

        return unwrapResponse(response);
    },

    async deleteOrganization(id) {
        const response = await axiosClient.delete(
            `/api/admin/organizations/${id}`
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * DEPARTMENTS
     * =====================================================
     */

    async getDepartments(organizationId = null) {
        const response = await axiosClient.get(
            "/api/admin/departments",
            {
                params: { organizationId }
            }
        );

        return unwrapResponse(response);
    },

    async createDepartment(data) {
        const response = await axiosClient.post(
            "/api/admin/departments",
            data
        );

        return unwrapResponse(response);
    },

    async updateDepartment(id, data) {
        const response = await axiosClient.put(
            `/api/admin/departments/${id}`,
            data
        );

        return unwrapResponse(response);
    },

    async deleteDepartment(id) {
        const response = await axiosClient.delete(
            `/api/admin/departments/${id}`
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * STAFF
     * =====================================================
     */

    async assignRecruiter(data) {
        const response = await axiosClient.post(
            "/api/admin/assign-recruiter",
            data
        );

        return unwrapResponse(response);
    },

    async assignHiringManager(data) {
        const response = await axiosClient.post(
            "/api/admin/assign-hiring-manager",
            data
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * ROLES
     * =====================================================
     */

    async getRoles() {
        const response = await axiosClient.get(
            "/api/admin/roles"
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * AUDIT LOGS
     * =====================================================
     */

    async getAuditLogs(params = {}) {
        const response = await axiosClient.get(
            "/api/admin/audit-logs",
            { params }
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * REPORTS
     * =====================================================
     */

    async getReports(startDate, endDate) {
        const response = await axiosClient.get(
            "/api/admin/reports",
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * ANALYTICS
     * =====================================================
     */

    async getAnalytics(startDate, endDate) {
        const response = await axiosClient.get(
            "/api/admin/analytics",
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );

        return unwrapResponse(response);
    },

    /*
     * =====================================================
     * SETTINGS
     * =====================================================
     */

    async getSettings() {
        const response = await axiosClient.get(
            "/api/admin/settings"
        );

        return unwrapResponse(response);
    },

    async updateSettings(data) {
        const response = await axiosClient.put(
            "/api/admin/settings",
            data
        );

        return unwrapResponse(response);
    }

};

export default adminService;
