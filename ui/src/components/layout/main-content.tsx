'use client';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { PropsWithChildren as PWC } from 'react';

import { DRAWER_WIDTH } from '~/util/constants';

export const MainContent = ({ children }: PWC) => {
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
            {children}
        </Box>
    );
};
