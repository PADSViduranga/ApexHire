import Chip from "@mui/material/Chip";

import {

    CheckCircle,

    Cancel

} from "@mui/icons-material";

export default function DepartmentStatusChip({

    active

}){

    return(

        <Chip

            icon={

                active

                    ?<CheckCircle/>

                    :<Cancel/>

            }

            label={

                active

                    ?"Active"

                    :"Inactive"

            }

            color={

                active

                    ?"success"

                    :"default"

            }

            size="small"

            variant="filled"

        />

    );

}

