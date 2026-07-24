import {

    Card,

    CardContent,

    Grid,

    Stack,

    Typography

} from "@mui/material";

import {

    Apartment,

    CheckCircle,

    Cancel,

    Groups

} from "@mui/icons-material";

export default function DepartmentStatsCards({

    statistics

}){

    const stats={

        total:

            statistics?.totalDepartments??

            0,

        active:

            statistics?.activeDepartments??

            0,

        inactive:

            statistics?.inactiveDepartments??

            0,

        employees:

            statistics?.totalEmployees??

            0

    };

    const cards=[

        {

            title:"Departments",

            value:stats.total,

            icon:<Apartment color="primary"/>

        },

        {

            title:"Active",

            value:stats.active,

            icon:<CheckCircle color="success"/>

        },

        {

            title:"Inactive",

            value:stats.inactive,

            icon:<Cancel color="error"/>

        },

        {

            title:"Employees",

            value:stats.employees,

            icon:<Groups color="info"/>

        }

    ];


    return(

        <Grid

            container

            spacing={2}

            sx={{

                mb:3

            }}

        >

            {

                cards.map(

                    card=>(

                        <Grid

                            item

                            xs={12}

                            sm={6}

                            md={3}

                            key={card.title}

                        >

                            <Card>

                                <CardContent>

                                    <Stack

                                        direction="row"

                                        justifyContent="space-between"

                                        alignItems="center"

                                    >

                                        <div>

                                            <Typography

                                                variant="body2"

                                                color="text.secondary"

                                            >

                                                {card.title}

                                            </Typography>

                                            <Typography

                                                variant="h4"

                                                fontWeight={700}

                                            >

                                                {card.value}

                                            </Typography>

                                        </div>

                                        {card.icon}

                                    </Stack>

                                </CardContent>

                            </Card>

                        </Grid>

                    )

                )

            }

        </Grid>

    );

}

