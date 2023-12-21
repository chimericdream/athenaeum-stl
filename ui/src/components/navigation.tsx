'use client';

import DashboardIcon from '@mui/icons-material/Dashboard';
import DeleteIcon from '@mui/icons-material/Delete';
import LabelIcon from '@mui/icons-material/Label';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import {
    AppBar,
    Box,
    Button,
    Divider,
    Drawer,
    type DrawerProps,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useState } from 'react';

import { useAppSidebar } from '~/contexts/app-sidebar-context';
import { DRAWER_WIDTH } from '~/util/constants';

export const Navigation = () => {
    const [leftNavOpen, setLeftNavOpen] = useState(false);
    const { sidebarContentRef } = useAppSidebar();

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
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexGrow: 1,
                        }}
                    >
                        <ViewInArIcon sx={{ mr: 2 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component={Link}
                            href="/"
                            color={theme.palette.text.primary}
                            sx={{ textDecoration: 'none' }}
                        >
                            Athenaeum STL Library
                        </Typography>
                    </Box>
                    <Box component="div" sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            sx={{
                                borderColor: '#fff',
                                color: '#fff',
                                '&:hover': {
                                    borderColor: theme.palette.info.main,
                                },
                            }}
                            component={Link}
                            href="/models"
                            startIcon={<DashboardIcon />}
                            variant={
                                pathname === '/models' ? 'outlined' : 'text'
                            }
                        >
                            Models
                        </Button>
                        <Button
                            sx={{
                                borderColor: '#fff',
                                color: '#fff',
                                '&:hover': {
                                    borderColor: theme.palette.info.main,
                                },
                            }}
                            component={Link}
                            href="/labels"
                            startIcon={<LabelIcon />}
                            variant={
                                pathname === '/labels' ? 'outlined' : 'text'
                            }
                        >
                            Labels
                        </Button>
                        {isMobile ? (
                            <IconButton
                                aria-label="Toggle left navigation"
                                onClick={toggleLeftNav}
                            >
                                <MenuIcon />
                            </IconButton>
                        ) : null}
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer {...drawerProps}>
                <Divider />
                <Box
                    component="div"
                    id="sidebar-content"
                    ref={sidebarContentRef}
                />
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
