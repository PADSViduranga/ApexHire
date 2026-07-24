import axiosClient from "../api/axiosClient";

class OrganizationService {

    async getOrganizations(params = {}) {

        return axiosClient.get(

            "/api/admin/organizations",

            {
                params
            }

        );

    }

    async getOrganizationById(id) {

        return axiosClient.get(

            `/api/admin/organizations/${id}`

        );

    }

    async createOrganization(data) {

        return axiosClient.post(

            "/api/admin/organizations",

            data

        );

    }

    async updateOrganization(id, data) {

        return axiosClient.put(

            `/api/admin/organizations/${id}`,

            data

        );

    }

    async deleteOrganization(id) {

        return axiosClient.delete(

            `/api/admin/organizations/${id}`

        );

    }

    async restoreOrganization(id) {

        return axiosClient.patch(

            `/api/admin/organizations/${id}/restore`

        );

    }

    async toggleOrganizationStatus(id) {

        return axiosClient.patch(

            `/api/admin/organizations/${id}/toggle-status`

        );

    }


    async assignRecruiter(

        organizationId,

        recruiterId

    ){

        return axiosClient.post(

            `/api/admin/organizations/${organizationId}/assign-recruiter`,

            {

                recruiterId

            }

        );

    }

    async removeRecruiter(

        organizationId,

        recruiterId

    ){

        return axiosClient.delete(

            `/api/admin/organizations/${organizationId}/recruiters/${recruiterId}`

        );

    }

    async assignHiringManager(

        organizationId,

        managerId

    ){

        return axiosClient.post(

            `/api/admin/organizations/${organizationId}/assign-hiring-manager`,

            {

                managerId

            }

        );

    }

    async removeHiringManager(

        organizationId,

        managerId

    ){

        return axiosClient.delete(

            `/api/admin/organizations/${organizationId}/hiring-managers/${managerId}`

        );

    }

    async getRecruiters(

        organizationId

    ){

        return axiosClient.get(

            `/api/admin/organizations/${organizationId}/recruiters`

        );

    }

    async getHiringManagers(

        organizationId

    ){

        return axiosClient.get(

            `/api/admin/organizations/${organizationId}/hiring-managers`

        );

    }


    async getDepartments(

        organizationId

    ){

        return axiosClient.get(

            `/api/admin/organizations/${organizationId}/departments`

        );

    }

    async getStatistics(){

        return axiosClient.get(

            "/api/admin/organizations/statistics"

        );

    }

    async exportOrganizations(

        params={}

    ){

        return axiosClient.get(

            "/api/admin/organizations/export",

            {

                params,

                responseType:"blob"

            }

        );

    }

    async searchOrganizations(

        search,

        page=1,

        pageSize=25

    ){

        return axiosClient.get(

            "/api/admin/organizations/search",

            {

                params:{

                    search,

                    page,

                    pageSize

                }

            }

        );

    }

    async checkOrganizationName(

        name,

        excludeId=null

    ){

        return axiosClient.get(

            "/api/admin/organizations/check-name",

            {

                params:{

                    name,

                    excludeId

                }

            }

        );

    }

}

const organizationService=new OrganizationService();

export default organizationService;

