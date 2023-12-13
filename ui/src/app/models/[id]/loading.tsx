'use client';

import { Box, Skeleton, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { type Breadcrumb, Breadcrumbs } from '~/components/layout/breadcrumbs';

export default function Page() {
    const crumbs: Breadcrumb[] = [
        {
            label: 'Models',
            href: '/models',
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
            <Box
                component="div"
                sx={{ display: 'flex', flexGrow: 1, gap: '1rem' }}
            >
                <Box component="div" sx={{ flexGrow: 1 }}>
                    <Skeleton variant="rectangular" sx={{ height: 500 }} />
                </Box>
                <Box
                    component="div"
                    sx={{
                        borderLeft: {
                            xs: 0,
                            sm: '1px solid rgba(255, 255, 255, 0.12)',
                        },
                        paddingLeft: {
                            xs: 0,
                            sm: '1rem',
                        },
                        width: {
                            xs: '100%',
                            sm: 'calc(33% - 1px)',
                        },
                    }}
                >
                    <Skeleton variant="rectangular" sx={{ height: 500 }} />
                </Box>
            </Box>
        </Box>
    );
}
