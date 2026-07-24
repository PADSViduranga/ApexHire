import Avatar from "@mui/material/Avatar";

import {

    Business

} from "@mui/icons-material";

import {

    getOrganizationInitials

} from "../../../utils/organizationHelpers";

export default function OrganizationAvatar({

    organization,

    size=40

}){

    const initials=

        getOrganizationInitials(

            organization?.name

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

                <Business/>

            }

        </Avatar>

    );

}

