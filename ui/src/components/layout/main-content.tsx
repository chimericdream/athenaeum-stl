'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { PropsWithChildren as PWC } from 'react';

import { DRAWER_WIDTH } from '~/util/constants';

export default function MainContent({ children }: PWC) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    return (
        <Box
            component="main"
            sx={{
                bgColor: 'background.default',
                ml: isMobile ? 0 : `${DRAWER_WIDTH}px`,
                mt: ['56px', '64px'],
                minHeight: isXs ? 'calc(100vh - 56px)' : 'calc(100vh - 64px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
            }}
        >
            <Grid
                container
                spacing={3}
                sx={{ flexGrow: 1, m: 0, width: '100%' }}
            >
                {children}
            </Grid>
        </Box>
    );
}
