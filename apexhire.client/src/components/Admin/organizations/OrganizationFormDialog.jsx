import {

    Button,

    Dialog,

    DialogActions,

    DialogContent,

    DialogTitle,

    Grid,

    Stack,

    Switch,

    FormControlLabel,

    TextField

} from "@mui/material";

import {

    useEffect,

    useState

} from "react";

import {

    defaultOrganizationValues

} from "../../../validation/organizationSchema";

export default function OrganizationFormDialog({

    open,

    editMode,

    organization,

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

        defaultOrganizationValues

    );

    useEffect(

        ()=>{

            if(

                organization

            ){

                setValues({

                    ...defaultOrganizationValues,

                    ...organization

                });

            }

            else{

                setValues(

                    defaultOrganizationValues

                );

            }

        },

        [

            organization,

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

                        ?"Edit Organization"

                        :"Create Organization"

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

                                label="Organization Name"

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

                                label="Website"

                                name="website"

                                value={values.website}

                                onChange={handleChange}

                                error={!!errors.website}

                                helperText={errors.website}

                            />

                        </Grid>

                        <Grid

                            item

                            xs={12}

                        >

                            <TextField

                                fullWidth

                                label="Address"

                                name="address"

                                value={values.address}

                                onChange={handleChange}

                                error={!!errors.address}

                                helperText={errors.address}

                            />

                        </Grid>

                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <TextField

                                fullWidth

                                label="City"

                                name="city"

                                value={values.city}

                                onChange={handleChange}

                                error={!!errors.city}

                                helperText={errors.city}

                            />

                        </Grid>

                        <Grid

                            item

                            xs={12}

                            md={6}

                        >

                            <TextField

                                fullWidth

                                label="Country"

                                name="country"

                                value={values.country}

                                onChange={handleChange}

                                error={!!errors.country}

                                helperText={errors.country}

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

                                    label="Organization is Active"

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

                                ?"Update Organization"

                                :"Create Organization"

                        }

                    </Button>

                </DialogActions>

            </form>

        </Dialog>

    );

}

