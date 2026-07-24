import axiosClient from "../api/axiosClient";

const endpoint="/departments";

const getDepartments=query=>

    axiosClient.get(

        endpoint,

        {

            params:query

        }

    );

const getDepartmentById=id=>

    axiosClient.get(

        `${endpoint}/${id}`

    );

const createDepartment=data=>

    axiosClient.post(

        endpoint,

        data

    );

const updateDepartment=(

    id,

    data

)=>

    axiosClient.put(

        `${endpoint}/${id}`,

        data

    );

const deleteDepartment=id=>

    axiosClient.delete(

        `${endpoint}/${id}`

    );

const restoreDepartment=id=>

    axiosClient.patch(

        `${endpoint}/${id}/restore`

    );

const toggleDepartmentStatus=(

    id,

    isActive

)=>

    axiosClient.patch(

        `${endpoint}/${id}/status`,

        {

            isActive

        }

    );


const getOrganizations=()=>

    axiosClient.get(

        "/organizations"

    );

const getDepartmentStatistics=()=>

    axiosClient.get(

        `${endpoint}/statistics`

    );

const exportDepartments=query=>

    axiosClient.get(

        `${endpoint}/export`,

        {

            params:query,

            responseType:"blob"

        }

    );

const searchDepartments=query=>

    axiosClient.get(

        `${endpoint}/search`,

        {

            params:query

        }

    );

const checkDepartmentName=(

    name,

    organizationId,

    excludeId

)=>

    axiosClient.get(

        `${endpoint}/check-name`,

        {

            params:{

                name,

                organizationId,

                excludeId

            }

        }

    );


export default{

    getDepartments,

    getDepartmentById,

    createDepartment,

    updateDepartment,

    deleteDepartment,

    restoreDepartment,

    toggleDepartmentStatus,

    getOrganizations,

    getDepartmentStatistics,

    exportDepartments,

    searchDepartments,

    checkDepartmentName

};

