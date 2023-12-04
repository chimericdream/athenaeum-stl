import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { type SxProps, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { GridDefaultBreakpoints } from '@mui/system';
import type { PropsWithChildren as PWC } from 'react';

interface ToggleableSidebarProps extends GridDefaultBreakpoints {
    open: boolean;
    toggle: () => void;
}

export const ToggleableSidebar = ({
    children,
    open,
    toggle,
    ...props
}: PWC<ToggleableSidebarProps>) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));

    const gridStyles: SxProps = isXs
        ? {
              backgroundColor: theme.palette.grey[300],
              p: 0,
              height: '100%',
              maxHeight: 'calc(100vh - 56px)',
              position: 'absolute',
              top: '56px',
              zIndex: 1,
          }
        : {
              backgroundColor: theme.palette.grey[300],
              p: 0,
              maxHeight: 'calc(100vh - 64px)',
              position: 'sticky',
              top: '64px',
          };

    return (
        <Slide direction="left" in={open} mountOnEnter unmountOnExit>
            <Grid {...props} sx={gridStyles}>
                <Box
                    sx={{
                        maxHeight: '100%',
                        overflowY: 'auto',
                        p: 2,
                        borderLeft: 'var(--fbc-borders)',
                    }}
                >
                    {isXs ? (
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'end',
                                mb: 2,
                            }}
                        >
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={toggle}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    ) : null}
                    {children}
                </Box>
            </Grid>
        </Slide>
    );
};
