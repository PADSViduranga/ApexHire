import Avatar from "@mui/material/Avatar";

import {

    Apartment

} from "@mui/icons-material";

import {

    getDepartmentInitials

} from "../../../utils/departmentHelpers";

export default function DepartmentAvatar({

    department,

    size=40

}){

    const initials=

        getDepartmentInitials(

            department?.name

        );

    return(

        <Avatar

            sx={{

                width:size,

                height:size

            }}

        >

            {

                initials||

                <Apartment/>

            }

        </Avatar>

    );

}

