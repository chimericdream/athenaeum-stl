'use client';

import SettingsIcon from '@mui/icons-material/Settings';
import Divider from '@mui/material/Divider';
import Drawer, { type DrawerProps } from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import ActionLeftNav from '~/components/layout/left-nav/action-left-nav';
import ContextLeftNav from '~/components/layout/left-nav/context-left-nav';
import InboxLeftNav from '~/components/layout/left-nav/inbox-left-nav';
import { DRAWER_WIDTH } from '~/util/constants';

interface LeftNavProps {
    open: boolean;
    toggleDrawer: () => void;
}

export default function LeftNav({ open, toggleDrawer }: LeftNavProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    const container =
        typeof window === 'undefined' ? undefined : () => window.document.body;

    const drawerProps: DrawerProps = isMobile
        ? {
              container: container,
              ModalProps: {
                  keepMounted: true,
              },
              onClose: toggleDrawer,
              open: open,
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
        <Drawer {...drawerProps}>
            <InboxLeftNav />
            <ActionLeftNav />
            <ContextLeftNav />
            <Divider sx={{ mt: 'auto' }} />
            <List>
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
    );
}
