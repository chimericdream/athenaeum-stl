'use client';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import type { PropsWithChildren as PWC } from 'react';

import { NextAppDirEmotionCacheProvider } from './emotion-cache';
import { theme } from './theme';

export const ThemeRegistry = ({ children }: PWC) => (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
        <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
        </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
);
