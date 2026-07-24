import {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
    TextField,
} from "@mui/material";

import {
    Apartment,
    Badge,
    Business,
    Email,
    Lock,
    Person,
    Phone
} from "@mui/icons-material";

const emptyForm={

    firstName:"",

    lastName:"",

    email:"",

    phoneNumber:"",

    role:"Candidate",

    organizationId:"",

    departmentId:"",

    password:"",

    confirmPassword:"",

    isActive:true

};

export default function UserFormDialog({

    open,

    editMode,

    loading,

    saving,

    user,

    organizations,

    departments,

    onClose,

    onSave

}){

    const[

        form,

        setForm

    ]=useState(

        emptyForm

    );

    const[

        errors,

        setErrors

    ]=useState({});

    const[

        submitError,

        setSubmitError

    ]=useState("");


    const isCreate=!editMode;

    const filteredDepartments=useMemo(

        ()=>{

            if(!form.organizationId){

                return [];

            }

            return departments.filter(

                department=>

                    String(

                        department.organizationId

                    )===String(

                        form.organizationId

                    )

            );

        },

        [

            departments,

            form.organizationId

        ]

    );

    useEffect(

        ()=>{

            if(!open){

                return;

            }

            setSubmitError("");

            setErrors({});

            if(editMode&&user){

                setForm({

                    firstName:user.firstName??"",

                    lastName:user.lastName??"",

                    email:user.email??"",

                    phoneNumber:user.phoneNumber??"",

                    role:user.role??"Candidate",

                    organizationId:

                        user.organizationId??"",

                    departmentId:

                        user.departmentId??"",

                    password:"",

                    confirmPassword:"",

                    isActive:

                        user.isActive??true

                });

            }

            else{

                setForm(emptyForm);

            }

        },

        [

            open,

            editMode,

            user

        ]

    );

    function updateField(

        field,

        value

    ){

        setForm(

            previous=>({

                ...previous,

                [field]:value

            })

        );

        if(

            errors[field]

        ){

            setErrors(

                previous=>({

                    ...previous,

                    [field]:""

                })

            );

        }

    }


    function validate(){

        const validationErrors={};

        if(

            !form.firstName.trim()

        ){

            validationErrors.firstName=

                "First name is required.";

        }

        if(

            !form.lastName.trim()

        ){

            validationErrors.lastName=

                "Last name is required.";

        }

        if(

            !form.email.trim()

        ){

            validationErrors.email=

                "Email is required.";

        }

        else if(

            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(

                form.email

            )

        ){

            validationErrors.email=

                "Enter a valid email address.";

        }

        if(

            form.phoneNumber &&

            !/^[0-9+\-()\s]{7,20}$/.test(

                form.phoneNumber

            )

        ){

            validationErrors.phoneNumber=

                "Invalid phone number.";

        }

        if(

            !form.role

        ){

            validationErrors.role=

                "Role is required.";

        }

        if(

            !form.organizationId

        ){

            validationErrors.organizationId=

                "Organization is required.";

        }

        if(

            !form.departmentId

        ){

            validationErrors.departmentId=

                "Department is required.";

        }

        if(

            isCreate

        ){

            if(

                !form.password

            ){

                validationErrors.password=

                    "Password is required.";

            }

            else if(

                form.password.length<8

            ){

                validationErrors.password=

                    "Password must contain at least 8 characters.";

            }

            if(

                form.password!==form.confirmPassword

            ){

                validationErrors.confirmPassword=

                    "Passwords do not match.";

            }

        }

        setErrors(

            validationErrors

        );

        return Object.keys(

            validationErrors

        ).length===0;

    }

    async function handleSubmit(){

        setSubmitError("");

        if(

            !validate()

        ){

            return;

        }

        try{

            await onSave(

                form

            );

        }

        catch(error){

            setSubmitError(

                error?.response?.data?.message ??

                error?.message ??

                "Unable to save user."

            );

        }

    }

    return(

        <Dialog

            open={open}

            onClose={

                saving

                    ?undefined

                    :onClose

            }

            maxWidth="md"

            fullWidth

        >

            <DialogTitle>

                {

                    editMode

                        ?"Edit User"

                        :"Create User"

                }

            </DialogTitle>

            <Divider/>

            <DialogContent
                sx={{
                    pt:3
                }}
            >

                {

                    submitError && (

                        <Alert
                            severity="error"
                            sx={{
                                mb:3
                            }}
                        >

                            {submitError}

                        </Alert>

                    )

                }


                <Grid
                    container
                    spacing={2}
                >

                    <Grid
                        size={{
                            xs:12,
                            md:6
                        }}
                    >

                        <TextField

                            fullWidth

                            label="First Name"

                            value={form.firstName}

                            onChange={(e)=>

                                updateField(

                                    "firstName",

                                    e.target.value

                                )

                            }

                            error={!!errors.firstName}

                            helperText={errors.firstName}

                            InputProps={{

                                startAdornment:(

                                    <InputAdornment position="start">

                                        <Person/>

                                    </InputAdornment>

                                )

                            }}

                        />

                    </Grid>

                    <Grid
                        size={{
                            xs:12,
                            md:6
                        }}
                    >

                        <TextField

                            fullWidth

                            label="Last Name"

                            value={form.lastName}

                            onChange={(e)=>

                                updateField(

                                    "lastName",

                                    e.target.value

                                )

                            }

                            error={!!errors.lastName}

                            helperText={errors.lastName}

                            InputProps={{

                                startAdornment:(

                                    <InputAdornment position="start">

                                        <Badge/>

                                    </InputAdornment>

                                )

                            }}

                        />

                    </Grid>

                    <Grid
                        size={{
                            xs:12,
                            md:6
                        }}
                    >

                        <TextField

                            fullWidth

                            label="Email"

                            value={form.email}

                            onChange={(e)=>

                                updateField(

                                    "email",

                                    e.target.value

                                )

                            }

                            error={!!errors.email}

                            helperText={errors.email}

                            InputProps={{

                                startAdornment:(

                                    <InputAdornment position="start">

                                        <Email/>

                                    </InputAdornment>

                                )

                            }}

                        />

                    </Grid>

                    <Grid
                        size={{
                            xs:12,
                            md:6
                        }}
                    >

                        <TextField

                            fullWidth

                            label="Phone Number"

                            value={form.phoneNumber}

                            onChange={(e)=>

                                updateField(

                                    "phoneNumber",

                                    e.target.value

                                )

                            }

                            error={!!errors.phoneNumber}

                            helperText={errors.phoneNumber}

                            InputProps={{

                                startAdornment:(

                                    <InputAdornment position="start">

                                        <Phone/>

                                    </InputAdornment>

                                )

                            }}

                        />

                    </Grid>

                    <Grid
                        size={{
                            xs:12,
                            md:6
                        }}
                    >

                        <TextField

                            fullWidth

                            select

                            label="Role"

                            value={form.role}

                            onChange={(e)=>

                                updateField(

                                    "role",

                                    e.target.value

                                )

                            }

                            error={!!errors.role}

                            helperText={errors.role}

                        >

                            <MenuItem value="Candidate">

                                Candidate

                            </MenuItem>

                            <MenuItem value="Recruiter">

                                Recruiter

                            </MenuItem>

                            <MenuItem value="HiringManager">

                                Hiring Manager

                            </MenuItem>

                            <MenuItem value="Administrator">

                                Administrator

                            </MenuItem>

                        </TextField>

                    </Grid>

                    <Grid
                        size={{
                            xs:12,
                            md:6
                        }}
                    >

                        <TextField

                            fullWidth

                            select

                            label="Organization"

                            value={form.organizationId}

                            onChange={(e)=>{

                                updateField(

                                    "organizationId",

                                    e.target.value

                                );

                                updateField(

                                    "departmentId",

                                    ""

                                );

                            }}

                            error={!!errors.organizationId}

                            helperText={errors.organizationId}

                            InputProps={{

                                startAdornment:(

                                    <InputAdornment position="start">

                                        <Business/>

                                    </InputAdornment>

                                )

                            }}

                        >

                            {

                                organizations.map(

                                    organization=>(

                                        <MenuItem

                                            key={organization.id}

                                            value={organization.id}

                                        >

                                            {organization.name}

                                        </MenuItem>

                                    )

                                )

                            }

                        </TextField>

                    </Grid>


                    <Grid
                        size={{
                            xs:12,
                            md:6
                        }}
                    >

                        <TextField

                            fullWidth

                            select

                            label="Department"

                            value={form.departmentId}

                            onChange={(e)=>

                                updateField(

                                    "departmentId",

                                    e.target.value

                                )

                            }

                            error={!!errors.departmentId}

                            helperText={

                                errors.departmentId ||

                                (

                                    !form.organizationId

                                    ? "Select an organization first."

                                    : ""

                                )

                            }

                            disabled={!form.organizationId}

                            InputProps={{

                                startAdornment:(

                                    <InputAdornment position="start">

                                        <Apartment/>

                                    </InputAdornment>

                                )

                            }}

                        >

                            {

                                filteredDepartments.map(

                                    department=>(

                                        <MenuItem

                                            key={department.id}

                                            value={department.id}

                                        >

                                            {department.name}

                                        </MenuItem>

                                    )

                                )

                            }

                        </TextField>

                    </Grid>

                    {

                        isCreate && (

                            <>

                                <Grid
                                    size={{
                                        xs:12,
                                        md:6
                                    }}
                                >

                                    <TextField

                                        fullWidth

                                        type="password"

                                        label="Password"

                                        value={form.password}

                                        onChange={(e)=>

                                            updateField(

                                                "password",

                                                e.target.value

                                            )

                                        }

                                        error={!!errors.password}

                                        helperText={errors.password}

                                        InputProps={{

                                            startAdornment:(

                                                <InputAdornment position="start">

                                                    <Lock/>

                                                </InputAdornment>

                                            )

                                        }}

                                    />

                                </Grid>

                                <Grid
                                    size={{
                                        xs:12,
                                        md:6
                                    }}
                                >

                                    <TextField

                                        fullWidth

                                        type="password"

                                        label="Confirm Password"

                                        value={form.confirmPassword}

                                        onChange={(e)=>

                                            updateField(

                                                "confirmPassword",

                                                e.target.value

                                            )

                                        }

                                        error={!!errors.confirmPassword}

                                        helperText={errors.confirmPassword}

                                        InputProps={{

                                            startAdornment:(

                                                <InputAdornment position="start">

                                                    <Lock/>

                                                </InputAdornment>

                                            )

                                        }}

                                    />

                                </Grid>

                            </>

                        )

                    }

                </Grid>

            </DialogContent>


            <Divider/>

            <DialogActions
                sx={{
                    px:3,
                    py:2
                }}
            >

                <Button

                    onClick={onClose}

                    disabled={saving}

                >

                    Cancel

                </Button>

                <Box
                    sx={{
                        position:"relative"
                    }}
                >

                    <Button

                        variant="contained"

                        onClick={handleSubmit}

                        disabled={saving||loading}

                    >

                        {

                            editMode

                                ?"Save Changes"

                                :"Create User"

                        }

                    </Button>

                    {

                        saving && (

                            <CircularProgress

                                size={24}

                                sx={{

                                    position:"absolute",

                                    top:"50%",

                                    left:"50%",

                                    marginTop:"-12px",

                                    marginLeft:"-12px"

                                }}

                            />

                        )

                    }

                </Box>

            </DialogActions>

        </Dialog>

    );

}

