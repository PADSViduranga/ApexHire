import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";

import {
    Alert,
    Breadcrumbs,
    Button,
    Card,
    CardContent,
    Container,
    Link,
    Snackbar,
    Stack,
    Typography
} from "@mui/material";

import {
    AdminPanelSettings,
    NavigateNext,
} from "@mui/icons-material";

import "../../styles/AdminUsers.css";

import UserToolbar from "../../components/Admin/users/UserToolbar";
import UserTable from "../../components/Admin/users/UserTable";
import UserFormDialog from "../../components/Admin/users/UserFormDialog";
import DeleteUserDialog from "../../components/Admin/users/DeleteUserDialog";
import ResetPasswordDialog from "../../components/Admin/users/ResetPasswordDialog";
import StatusDialog from "../../components/Admin/users/StatusDialog";

import adminService from "../../services/adminService";

const DEFAULT_PAGE_SIZE = 25;

const initialFilters = {
    search: "",
    role: "",
    status: "",
    organizationId: "",
    departmentId: ""
};

const initialDialogState = {
    formOpen: false,
    deleteOpen: false,
    resetPasswordOpen: false,
    statusOpen: false
};

function getErrorMessage(error, fallbackMessage) {
    const responseData = error?.response?.data;

    if (typeof responseData === "string" && responseData.trim()) {
        return responseData;
    }

    if (responseData?.message) {
        return responseData.message;
    }

    if (responseData?.title) {
        return responseData.title;
    }

    if (error?.message) {
        return error.message;
    }

    return fallbackMessage;
}

function normalizeCollectionResponse(response) {
    const payload = response?.data ?? response ?? {};

    const items =
        payload.items ??
        payload.data ??
        payload.results ??
        payload.users ??
        [];

    const total =
        payload.totalCount ??
        payload.total ??
        payload.count ??
        items.length;

    return {
        items: Array.isArray(items) ? items : [],
        total: Number.isFinite(Number(total))
            ? Number(total)
            : 0
    };
}

function normalizeListResponse(response, possibleKeys = []) {
    const payload = response?.data ?? response ?? {};

    if (Array.isArray(payload)) {
        return payload;
    }

    for (const key of possibleKeys) {
        if (Array.isArray(payload[key])) {
            return payload[key];
        }
    }

    if (Array.isArray(payload.items)) {
        return payload.items;
    }

    if (Array.isArray(payload.data)) {
        return payload.data;
    }

    return [];
}

export default function Users() {
    const requestIdRef = useRef(0);
    const mountedRef = useRef(true);

    const [users, setUsers] = useState([]);
    const [totalRows, setTotalRows] = useState(0);

    const [organizations, setOrganizations] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

    const [sortModel, setSortModel] = useState([
        {
            field: "createdAt",
            sort: "desc"
        }
    ]);

    const [filters, setFilters] = useState(initialFilters);

    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [dialogs, setDialogs] = useState(initialDialogState);

    const [loading, setLoading] = useState(true);
    const [referenceLoading, setReferenceLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const [pageError, setPageError] = useState("");

    const [notification, setNotification] = useState({
        open: false,
        severity: "success",
        message: ""
    });

    const showNotification = useCallback(

        (

            severity,

            message

        )=>{

            setNotification({

                open:true,

                severity,

                message

            });

        },

        []

    );

    const closeNotification=useCallback(

        ()=>{

            setNotification(

                previous=>({

                    ...previous,

                    open:false

                })

            );

        },

        []

    );

    const openCreateDialog=useCallback(

        ()=>{

            setSelectedUser(null);

            setEditMode(false);

            setDialogs(

                previous=>({

                    ...previous,

                    formOpen:true

                })

            );

        },

        []

    );

    const openEditDialog=useCallback(

        (

            user

        )=>{

            setSelectedUser(user);

            setEditMode(true);

            setDialogs(

                previous=>({

                    ...previous,

                    formOpen:true

                })

            );

        },

        []

    );

    const closeFormDialog=useCallback(

        ()=>{

            if(

                saving

            ){

                return;

            }

            setDialogs(

                previous=>({

                    ...previous,

                    formOpen:false

                })

            );

            setSelectedUser(null);

            setEditMode(false);

        },

        [

            saving

        ]

    );

    const closeDeleteDialog=useCallback(

        ()=>{

            if(

                actionLoading

            ){

                return;

            }

            setDialogs(

                previous=>({

                    ...previous,

                    deleteOpen:false

                })

            );

        },

        [

            actionLoading

        ]

    );

    const closeResetPasswordDialog=useCallback(

        ()=>{

            if(

                actionLoading

            ){

                return;

            }

            setDialogs(

                previous=>({

                    ...previous,

                    resetPasswordOpen:false

                })

            );

        },

        [

            actionLoading

        ]

    );

    const closeStatusDialog=useCallback(

        ()=>{

            if(

                actionLoading

            ){

                return;

            }

            setDialogs(

                previous=>({

                    ...previous,

                    statusOpen:false

                })

            );

        },

        [

            actionLoading

        ]
    );


    const loadReferenceData = useCallback(

        async()=>{

            setReferenceLoading(true);

            try{

                const [

                    organizationsResponse,

                    departmentsResponse

                ]=await Promise.all([

                    adminService.getOrganizations(),

                    adminService.getDepartments()

                ]);

                if(

                    !mountedRef.current

                ){

                    return;

                }

                setOrganizations(

                    normalizeListResponse(

                        organizationsResponse,

                        [

                            "organizations"

                        ]

                    )

                );

                setDepartments(

                    normalizeListResponse(

                        departmentsResponse,

                        [

                            "departments"

                        ]

                    )

                );

            }

            catch(error){

                if(

                    !mountedRef.current

                ){

                    return;

                }

                showNotification(

                    "error",

                    getErrorMessage(

                        error,

                        "Unable to load organizations and departments."

                    )

                );

            }

            finally{

                if(

                    mountedRef.current

                ){

                    setReferenceLoading(false);

                }

            }

        },

        [

            showNotification

        ]

    );

    const queryParameters=useMemo(

        ()=>{

            const activeSort=sortModel?.[0];

            const parameters={

                pageNumber:page+1,

                pageSize,

                search:filters.search?.trim()||undefined,

                role:filters.role||undefined,

                status:

                    filters.status===""||

                    filters.status===null||

                    filters.status===undefined

                        ?undefined

                        :filters.status,

                organizationId:

                    filters.organizationId||undefined,

                departmentId:

                    filters.departmentId||undefined,

                sortBy:

                    activeSort?.field||"createdAt",

                sortDirection:

                    activeSort?.sort||"desc"

            };

            return Object.fromEntries(

                Object.entries(

                    parameters

                ).filter(

                    ([,value])=>

                        value!==undefined&&

                        value!==null&&

                        value!==""

                )

            );

        },

        [

            page,

            pageSize,

            filters,

            sortModel

        ]

    );

    const loadUsers=useCallback(

        async()=>{

            const requestId=++requestIdRef.current;

            setLoading(true);

            setPageError("");

            try{

                const response=

                    await adminService.getUsers(

                        queryParameters

                    );

                if(

                    !mountedRef.current||

                    requestId!==requestIdRef.current

                ){

                    return;

                }

                const normalized=

                    normalizeCollectionResponse(

                        response

                    );

                setUsers(

                    normalized.items

                );

                setTotalRows(

                    normalized.total

                );

            }

            catch(error){

                if(

                    !mountedRef.current||

                    requestId!==requestIdRef.current

                ){

                    return;

                }

                setUsers([]);

                setTotalRows(0);

                setPageError(

                    getErrorMessage(

                        error,

                        "Unable to load users."

                    )

                );

            }

            finally{

                if(

                    mountedRef.current&&

                    requestId===requestIdRef.current

                ){

                    setLoading(false);

                }

            }

        },

        [

            queryParameters

        ]

    );


    useEffect(

        ()=>{

            mountedRef.current=true;

            loadReferenceData();

            return()=>{

                mountedRef.current=false;

            };

        },

        [

            loadReferenceData

        ]

    );

    useEffect(

        ()=>{

            loadUsers();

        },

        [

            loadUsers

        ]

    );

    const refreshUsers=useCallback(

        ()=>{

            loadUsers();

        },

        [

            loadUsers

        ]

    );

    const handleFilterChange=useCallback(

        (

            nextFilters

        )=>{

            setPage(0);

            setFilters(

                nextFilters

            );

        },

        []

    );

    const handleSortModelChange=useCallback(

        (

            model

        )=>{

            setSortModel(

                model.length

                    ?model

                    :[

                        {

                            field:"createdAt",

                            sort:"desc"

                        }

                    ]

            );

        },

        []

    );

    const handleEdit=useCallback(

        (

            user

        )=>{

            openEditDialog(

                user

            );

        },

        [

            openEditDialog

        ]

    );

    const handleDelete=useCallback(

        (

            user

        )=>{

            setSelectedUser(

                user

            );

            setDialogs(

                previous=>({

                    ...previous,

                    deleteOpen:true

                })

            );

        },

        []

    );

    const handleResetPassword=useCallback(

        (

            user

        )=>{

            setSelectedUser(

                user

            );

            setDialogs(

                previous=>({

                    ...previous,

                    resetPasswordOpen:true

                })

            );

        },

        []

    );

    const handleStatus=useCallback(

        (

            user

        )=>{

            setSelectedUser(

                user

            );

            setDialogs(

                previous=>({

                    ...previous,

                    statusOpen:true

                })

            );

        },

        []

    );


    const handleSaveUser=useCallback(

        async(

            formData

        )=>{

            setSaving(true);

            try{

                if(

                    editMode&&

                    selectedUser?.id

                ){

                    const payload={

                        firstName:formData.firstName.trim(),

                        lastName:formData.lastName.trim(),

                        email:formData.email.trim(),

                        phoneNumber:

                            formData.phoneNumber?.trim()||null,

                        role:formData.role,

                        organizationId:

                            formData.organizationId||null,

                        departmentId:

                            formData.departmentId||null,

                        isActive:formData.isActive

                    };

                    await adminService.updateUser(

                        selectedUser.id,

                        payload

                    );

                    showNotification(

                        "success",

                        "User updated successfully."

                    );

                }

                else{

                    const payload={

                        firstName:formData.firstName.trim(),

                        lastName:formData.lastName.trim(),

                        email:formData.email.trim(),

                        phoneNumber:

                            formData.phoneNumber?.trim()||null,

                        role:formData.role,

                        organizationId:

                            formData.organizationId||null,

                        departmentId:

                            formData.departmentId||null,

                        password:formData.password,

                        confirmPassword:

                            formData.confirmPassword,

                        isActive:formData.isActive

                    };

                    await adminService.createUser(

                        payload

                    );

                    showNotification(

                        "success",

                        "User created successfully."

                    );

                }

                if(

                    !mountedRef.current

                ){

                    return;

                }

                setDialogs(

                    previous=>({

                        ...previous,

                        formOpen:false

                    })

                );

                setSelectedUser(null);

                setEditMode(false);

                await loadUsers();

            }

            finally{

                if(

                    mountedRef.current

                ){

                    setSaving(false);

                }

            }

        },

        [

            editMode,

            selectedUser,

            loadUsers,

            showNotification

        ]

    );

    const confirmDeleteUser=useCallback(

        async()=>{

            if(

                !selectedUser?.id

            ){

                return;

            }

            setActionLoading(true);

            try{

                await adminService.deleteUser(

                    selectedUser.id

                );

                if(

                    !mountedRef.current

                ){

                    return;

                }

                setDialogs(

                    previous=>({

                        ...previous,

                        deleteOpen:false

                    })

                );

                setSelectedUser(null);

                showNotification(

                    "success",

                    "User deleted successfully."

                );

                if(

                    users.length===1&&

                    page>0

                ){

                    setPage(

                        previous=>previous-1

                    );

                }

                else{

                    await loadUsers();

                }

            }

            catch(error){

                if(

                    mountedRef.current

                ){

                    showNotification(

                        "error",

                        getErrorMessage(

                            error,

                            "Unable to delete user."

                        )

                    );

                }

            }

            finally{

                if(

                    mountedRef.current

                ){

                    setActionLoading(false);

                }

            }

        },

        [

            selectedUser,

            users.length,

            page,

            loadUsers,

            showNotification

        ]

    );


    const confirmResetPassword=useCallback(

        async(

            password

        )=>{

            if(

                !selectedUser?.id

            ){

                return;

            }

            setActionLoading(true);

            try{

                await adminService.resetUserPassword(

                    selectedUser.id,

                    {

                        password

                    }

                );

                if(

                    !mountedRef.current

                ){

                    return;

                }

                setDialogs(

                    previous=>({

                        ...previous,

                        resetPasswordOpen:false

                    })

                );

                setSelectedUser(null);

                showNotification(

                    "success",

                    "Password reset successfully."

                );

            }

            catch(error){

                if(

                    mountedRef.current

                ){

                    showNotification(

                        "error",

                        getErrorMessage(

                            error,

                            "Unable to reset password."

                        )

                    );

                }

            }

            finally{

                if(

                    mountedRef.current

                ){

                    setActionLoading(false);

                }

            }

        },

        [

            selectedUser,

            showNotification

        ]

    );

    const confirmStatusChange=useCallback(

        async()=>{

            if(

                !selectedUser?.id

            ){

                return;

            }

            setActionLoading(true);

            try{

                await adminService.toggleUserStatus(

                    selectedUser.id

                );

                if(

                    !mountedRef.current

                ){

                    return;

                }

                setDialogs(

                    previous=>({

                        ...previous,

                        statusOpen:false

                    })

                );

                setSelectedUser(null);

                showNotification(

                    "success",

                    "User status updated successfully."

                );

                await loadUsers();

            }

            catch(error){

                if(

                    mountedRef.current

                ){

                    showNotification(

                        "error",

                        getErrorMessage(

                            error,

                            "Unable to update user status."

                        )

                    );

                }

            }

            finally{

                if(

                    mountedRef.current

                ){

                    setActionLoading(false);

                }

            }

        },

        [

            selectedUser,

            loadUsers,

            showNotification

        ]

    );

    return(

        <Container

            maxWidth="xl"

            sx={{

                py:4

            }}

        >

            <Stack

                spacing={3}

            >

                <Breadcrumbs

                    separator={<NavigateNext fontSize="small"/>}

                >

                    <Link

                        underline="hover"

                        color="inherit"

                        href="#"

                    >

                        Dashboard

                    </Link>

                    <Typography color="text.primary">

                        Users

                    </Typography>

                </Breadcrumbs>

                <Stack

                    direction="row"

                    justifyContent="space-between"

                    alignItems="center"

                >

                    <Stack>

                        <Typography

                            variant="h4"

                            fontWeight={700}

                        >

                            User Management

                        </Typography>

                        <Typography

                            color="text.secondary"

                        >

                            Manage users, permissions and access.

                        </Typography>

                    </Stack>

                    <Button

                        variant="contained"

                        startIcon={<AdminPanelSettings/>}

                        onClick={openCreateDialog}

                    >

                        New User

                    </Button>

                </Stack>


                {

                    pageError && (

                        <Alert

                            severity="error"

                            action={

                                <Button

                                    color="inherit"

                                    size="small"

                                    onClick={refreshUsers}

                                >

                                    Retry

                                </Button>

                            }

                        >

                            {pageError}

                        </Alert>

                    )

                }

                <Card>

                    <CardContent>

                        <UserToolbar

                            filters={filters}

                            loading={loading}

                            onFilterChange={handleFilterChange}

                            onRefresh={refreshUsers}

                            onAddUser={openCreateDialog}

                        />

                        <UserTable

                            rows={users}

                            loading={loading}

                            totalRows={totalRows}

                            page={page}

                            pageSize={pageSize}

                            sortModel={sortModel}

                            onPageChange={setPage}

                            onPageSizeChange={(newPageSize)=>{

                                setPageSize(newPageSize);

                                setPage(0);

                            }}

                            onSortModelChange={handleSortModelChange}

                            onEdit={handleEdit}

                            onDelete={handleDelete}

                            onResetPassword={handleResetPassword}

                            onToggleStatus={handleStatus}

                        />

                    </CardContent>

                </Card>

            </Stack>

            <UserFormDialog

                open={dialogs.formOpen}

                editMode={editMode}

                loading={referenceLoading}

                saving={saving}

                user={selectedUser}

                organizations={organizations}

                departments={departments}

                onClose={closeFormDialog}

                onSave={handleSaveUser}

            />

            <DeleteUserDialog

                open={dialogs.deleteOpen}

                user={selectedUser}

                loading={actionLoading}

                onClose={closeDeleteDialog}

                onConfirm={confirmDeleteUser}

            />

            <ResetPasswordDialog

                open={dialogs.resetPasswordOpen}

                user={selectedUser}

                loading={actionLoading}

                onClose={closeResetPasswordDialog}

                onConfirm={confirmResetPassword}

            />

            <StatusDialog

                open={dialogs.statusOpen}

                user={selectedUser}

                loading={actionLoading}

                onClose={closeStatusDialog}

                onConfirm={confirmStatusChange}

            />

            <Snackbar

                open={notification.open}

                autoHideDuration={5000}

                onClose={closeNotification}

                anchorOrigin={{

                    vertical:"bottom",

                    horizontal:"right"

                }}

            >

                <Alert

                    severity={notification.severity}

                    variant="filled"

                    onClose={closeNotification}

                    sx={{

                        width:"100%"

                    }}

                >

                    {notification.message}

                </Alert>

            </Snackbar>

        </Container>

    );

}
