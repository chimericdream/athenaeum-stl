'use client';

import { Box, SvgIcon, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { ReactElement } from 'react';

interface PageTitleProps {
    title: string;
    subtitle?: string | ReactElement;
    Icon?: typeof SvgIcon;
}

export const PageTitle = (props: PageTitleProps) => {
    const { title, subtitle, Icon } = props;
    const theme = useTheme();

    return (
        <Box
            component="div"
            sx={{ display: 'flex', height: 'auto', gap: '1rem' }}
        >
            {Icon && (
                <Box component="div">
                    <Icon
                        sx={{
                            fontSize: theme.typography.h4.fontSize,
                            lineHeight: theme.typography.h4.lineHeight,
                        }}
                    />
                </Box>
            )}
            <Box component="div" sx={{ flexGrow: 1 }}>
                <Typography variant="h4">{title}</Typography>
                {subtitle && (
                    <Typography
                        variant="body1"
                        component="div"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};
