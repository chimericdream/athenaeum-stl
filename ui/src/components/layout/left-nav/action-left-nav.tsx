import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const ActionLeftNav = () => {
    const pathname = usePathname();

    const MENU_ITEMS = [
        {
            href: '/next-actions',
            icon: <CheckIcon />,
            text: 'Next Actions',
        },
        {
            href: '/calendar',
            icon: <CalendarMonthIcon />,
            text: 'Calendar',
        },
        {
            href: '/actions',
            icon: <FormatListBulletedIcon />,
            text: 'All Actions',
        },
    ];

    return (
        <>
            <Divider />
            <List>
                <ListSubheader disableSticky>Actions</ListSubheader>
                {MENU_ITEMS.map(({ href, icon, text }) => (
                    <ListItemButton
                        key={href}
                        component={Link}
                        href={href}
                        selected={pathname === href}
                    >
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItemButton>
                ))}
            </List>
        </>
    );
};
