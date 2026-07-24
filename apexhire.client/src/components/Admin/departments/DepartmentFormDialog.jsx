import {

    Button,

    Dialog,

    DialogActions,

    DialogContent,

    DialogTitle,

    FormControlLabel,

    Grid,

    MenuItem,

    Stack,

    Switch,

    TextField

} from "@mui/material";

import {

    useEffect,

    useState

} from "react";

import {

    defaultDepartmentValues

} from "../../../validation/departmentSchema";

export default function DepartmentFormDialog({

    open,

    editMode,

    department,

    organizations,

    errors,

    validating,

    onSubmit,

    onClose,

    clearError

}){

    const[

        values,

        setValues

    ]=useState(

        defaultDepartmentValues

    );

    useEffect(

        ()=>{

            if(

                department

            ){

                setValues({

                    ...defaultDepartmentValues,

                    ...department

                });

            }

            else{

                setValues(

                    defaultDepartmentValues

                );

            }

        },

        [

            department,

            open

        ]

    );


    function handleChange(

        event

    ){

        const{

            name,

            value,

            checked,

            type

        }=event.target;

        setValues(

            previous=>({

                ...previous,

                [name]:

                    type==="checkbox"

                        ?checked

                        :value

            })

        );

        clearError?.(

            name

        );

    }

    function handleSubmit(

        event

    ){

        event.preventDefault();

        onSubmit(

            values

        );

    }

    return(

        <Dialog

            open={open}

            onClose={onClose}

            fullWidth

            maxWidth="md"

        >

            <DialogTitle>

                {

                    editMode

                        ?"Edit Department"

                        :"Create Department"

                }

            </DialogTitle>

            <form

                onSubmit={handleSubmit}

            >

                <DialogContent>

                    <Grid

                        container

                        spacing={2}

                    >

                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <TextField

                                fullWidth

                                required

                                select

                                label="Organization"

                                name="organizationId"

                                value={values.organizationId}

                                onChange={handleChange}

                                error={!!errors.organizationId}

                                helperText={errors.organizationId}

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

                            item

                            xs={12}

                            md={6}

                        >

                            <TextField

                                fullWidth

                                required

                                label="Department Name"

                                name="name"

                                value={values.name}

                                onChange={handleChange}

                                error={!!errors.name}

                                helperText={errors.name}

                            />

                        </Grid>

                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <TextField

                                fullWidth

                                required

                                label="Code"

                                name="code"

                                value={values.code}

                                onChange={handleChange}

                                error={!!errors.code}

                                helperText={errors.code}

                            />

                        </Grid>


                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <TextField

                                fullWidth

                                label="Manager Name"

                                name="managerName"

                                value={values.managerName}

                                onChange={handleChange}

                                error={!!errors.managerName}

                                helperText={errors.managerName}

                            />

                        </Grid>

                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <TextField

                                fullWidth

                                label="Email"

                                name="email"

                                value={values.email}

                                onChange={handleChange}

                                error={!!errors.email}

                                helperText={errors.email}

                            />

                        </Grid>

                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <TextField

                                fullWidth

                                label="Phone Number"

                                name="phoneNumber"

                                value={values.phoneNumber}

                                onChange={handleChange}

                                error={!!errors.phoneNumber}

                                helperText={errors.phoneNumber}

                            />

                        </Grid>

                        <Grid

                            item

                            xs={12}

                        >

                            <TextField

                                fullWidth

                                label="Location"

                                name="location"

                                value={values.location}

                                onChange={handleChange}

                                error={!!errors.location}

                                helperText={errors.location}

                            />

                        </Grid>


                        <Grid

                            item

                            xs={12}

                        >

                            <TextField

                                fullWidth

                                multiline

                                minRows={4}

                                label="Description"

                                name="description"

                                value={values.description}

                                onChange={handleChange}

                                error={!!errors.description}

                                helperText={errors.description}

                            />

                        </Grid>

                        <Grid

                            item

                            xs={12}

                        >

                            <Stack>

                                <FormControlLabel

                                    control={

                                        <Switch

                                            name="isActive"

                                            checked={values.isActive}

                                            onChange={handleChange}

                                        />

                                    }

                                    label="Department is Active"

                                />

                            </Stack>

                        </Grid>

                    </Grid>

                </DialogContent>

                <DialogActions>

                    <Button

                        onClick={onClose}

                    >

                        Cancel

                    </Button>

                    <Button

                        type="submit"

                        variant="contained"

                        disabled={validating}

                    >

                        {

                            editMode

                                ?"Update Department"

                                :"Create Department"

                        }

                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

}

