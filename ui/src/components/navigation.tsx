'use client';

import DeleteIcon from '@mui/icons-material/Delete';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import Drawer, { DrawerProps } from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import { LabelsLeftNav } from '~/components/layout/left-nav/labels-left-nav';
import { ModelsLeftNav } from '~/components/layout/left-nav/models-left-nav';
import { DRAWER_WIDTH } from '~/util/constants';

export const Navigation = () => {
    const [leftNavOpen, setLeftNavOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    const toggleLeftNav = useCallback(() => {
        setLeftNavOpen((prev) => !prev);
    }, [setLeftNavOpen]);

    const container =
        typeof window === 'undefined' ? undefined : () => window.document.body;

    const drawerProps: DrawerProps = isMobile
        ? {
              container: container,
              ModalProps: {
                  keepMounted: true,
              },
              onClose: toggleLeftNav,
              open: leftNavOpen,
              sx: {
                  display: { xs: 'block', lg: 'none' },
                  '& .MuiDrawer-paper': {
                      boxSizing: 'border-box',
                      maxWidth: '100%',
                      top: ['56px', '64px'],
                      width: DRAWER_WIDTH,
                  },
              },
              variant: 'temporary',
          }
        : {
              anchor: 'left',
              open: true,
              sx: {
                  display: { xs: 'none', lg: 'block' },
                  flexShrink: 0,
                  width: DRAWER_WIDTH,
                  '& .MuiDrawer-paper': {
                      bottom: 0,
                      boxSizing: 'border-box',
                      height: 'auto',
                      top: '64px',
                      width: DRAWER_WIDTH,
                  },
              },
              variant: 'permanent',
          };

    const pathname = usePathname();

    return (
        <>
            <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
                <Toolbar sx={{ backgroundColor: 'background.paper' }}>
                    <ViewInArIcon sx={{ mr: 2 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        href="/"
                        color={theme.palette.text.primary}
                        sx={{ flexGrow: 1, textDecoration: 'none' }}
                    >
                        Athenaeum STL Library
                    </Typography>
                    {isMobile ? (
                        <IconButton
                            aria-label="Toggle left navigation"
                            onClick={toggleLeftNav}
                        >
                            <MenuIcon />
                        </IconButton>
                    ) : null}
                </Toolbar>
            </AppBar>
            <Drawer {...drawerProps}>
                <Divider />
                <ModelsLeftNav />
                <LabelsLeftNav />
                <Divider sx={{ mt: 'auto' }} />
                <List>
                    <ListItemButton
                        component={Link}
                        href="/trash"
                        selected={pathname === '/trash'}
                    >
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Trash" />
                    </ListItemButton>
                    <ListItemButton
                        component={Link}
                        href="/settings"
                        selected={pathname === '/settings'}
                    >
                        <ListItemIcon>
                            <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                    </ListItemButton>
                </List>
            </Drawer>
        </>
    );
};
