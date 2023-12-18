'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { type Breadcrumb, Breadcrumbs } from '~/components/layout/breadcrumbs';

export default function Page() {
    const crumbs: Breadcrumb[] = [
        {
            label: 'Labels',
            href: '/labels',
        },
        {
            label: <Skeleton width={200} />,
            href: '',
        },
    ];

    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: '1rem',
                padding: '1rem',
                width: '100%',
            }}
        >
            <Grid xs={12} sm={8}>
                <Box component="div" sx={{ width: { xs: '100%', sm: '67%' } }}>
                    <Typography variant="h4">
                        <Skeleton width={200} />
                    </Typography>
                </Box>
                <Breadcrumbs crumbs={crumbs} />
            </Grid>
            <Box component="div" sx={{ flexGrow: 1 }}>
                <Skeleton variant="rectangular" sx={{ height: 500 }} />
            </Box>
        </Box>
    );
}
