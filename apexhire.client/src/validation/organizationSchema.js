import * as yup from "yup";

const phoneRegex=/^[0-9+\-()\s]{7,20}$/;

const websiteRegex=/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

export const organizationSchema=yup.object({

    name:yup

        .string()

        .trim()

        .required("Organization name is required.")

        .min(

            3,

            "Organization name must contain at least 3 characters."

        )

        .max(

            150,

            "Organization name cannot exceed 150 characters."

        ),

    code:yup

        .string()

        .trim()

        .required("Organization code is required.")

        .min(

            2,

            "Organization code must contain at least 2 characters."

        )

        .max(

            20,

            "Organization code cannot exceed 20 characters."

        )

        .matches(

            /^[A-Za-z0-9_-]+$/,

            "Only letters, numbers, hyphens and underscores are allowed."

        ),

    email:yup

        .string()

        .trim()

        .email(

            "Enter a valid email address."

        )

        .required(

            "Organization email is required."

        ),

    phoneNumber:yup

        .string()

        .trim()

        .nullable()

        .test(

            "phone",

            "Invalid phone number.",

            value=>

                !value||

                phoneRegex.test(value)

        ),


    website:yup

        .string()

        .trim()

        .nullable()

        .test(

            "website",

            "Enter a valid website URL.",

            value=>

                !value||

                websiteRegex.test(value)

        ),

    address:yup

        .string()

        .trim()

        .required(

            "Address is required."

        )

        .min(

            5,

            "Address must contain at least 5 characters."

        )

        .max(

            300,

            "Address cannot exceed 300 characters."

        ),

    city:yup

        .string()

        .trim()

        .required(

            "City is required."

        )

        .max(

            100,

            "City cannot exceed 100 characters."

        ),

    country:yup

        .string()

        .trim()

        .required(

            "Country is required."

        )

        .max(

            100,

            "Country cannot exceed 100 characters."

        ),

    description:yup

        .string()

        .trim()

        .nullable()

        .max(

            1000,

            "Description cannot exceed 1000 characters."

        ),

    isActive:yup

        .boolean()

        .required()


});

export const defaultOrganizationValues={

    name:"",

    code:"",

    email:"",

    phoneNumber:"",

    website:"",

    address:"",

    city:"",

    country:"",

    description:"",

    isActive:true

};

export const organizationValidationOptions={

    abortEarly:false,

    stripUnknown:true

};

export async function validateOrganization(

    data

){

    return organizationSchema.validate(

        data,

        organizationValidationOptions

    );

}

export default organizationSchema;

