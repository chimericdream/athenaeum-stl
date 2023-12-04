import InboxIcon from '@mui/icons-material/Inbox';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const InboxLeftNav = () => {
    const pathname = usePathname();

    return (
        <>
            <Divider />
            <List>
                <ListItemButton
                    component={Link}
                    href="/inbox"
                    selected={pathname === '/inbox'}
                >
                    <ListItemIcon>
                        <InboxIcon />
                    </ListItemIcon>
                    <ListItemText primary="Inbox" />
                </ListItemButton>
            </List>
        </>
    );
};
