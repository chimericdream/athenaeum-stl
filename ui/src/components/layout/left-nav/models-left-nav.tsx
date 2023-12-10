'use client';

import DashboardIcon from '@mui/icons-material/Dashboard';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ModelsLeftNav = () => {
    const pathname = usePathname();

    return (
        <List>
            <ListItemButton
                component={Link}
                href="/models"
                selected={pathname === '/models'}
            >
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Models" />
            </ListItemButton>
        </List>
    );
};
