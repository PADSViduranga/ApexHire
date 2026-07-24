import * as Yup from "yup";

export const departmentSchema=

    Yup.object({

        name:Yup.string()

            .trim()

            .required(

                "Department name is required."

            )

            .max(

                100,

                "Department name cannot exceed 100 characters."

            ),

        code:Yup.string()

            .trim()

            .required(

                "Department code is required."

            )

            .max(

                20,

                "Department code cannot exceed 20 characters."

            ),

        organizationId:Yup.number()

            .required(

                "Organization is required."

            )

            .positive(),

        email:Yup.string()

            .trim()

            .email(

                "Enter a valid email address."

            )

            .nullable(),

        phoneNumber:Yup.string()

            .trim()

            .max(

                20,

                "Phone number cannot exceed 20 characters."

            )

            .nullable(),


        managerName:Yup.string()

            .trim()

            .max(

                100,

                "Manager name cannot exceed 100 characters."

            )

            .nullable(),

        location:Yup.string()

            .trim()

            .max(

                150,

                "Location cannot exceed 150 characters."

            )

            .nullable(),

        description:Yup.string()

            .trim()

            .max(

                500,

                "Description cannot exceed 500 characters."

            )

            .nullable(),

        isActive:Yup.boolean()

            .required()

    });

export const defaultDepartmentValues={

    name:"",

    code:"",

    organizationId:"",

    email:"",

    phoneNumber:"",

    managerName:"",

    location:"",

    description:"",

    isActive:true

};


export const organizationValidationOptions={

    abortEarly:false

};

export async function validateDepartment(

    values

){

    try{

        await departmentSchema.validate(

            values,

            organizationValidationOptions

        );

        return{

            isValid:true,

            errors:{}

        };

    }

    catch(error){

        const errors={};

        error.inner.forEach(

            item=>{

                if(

                    !errors[item.path]

                ){

                    errors[item.path]=

                        item.message;

                }

            }

        );

        return{

            isValid:false,

            errors

        };

    }

}

export default departmentSchema;

