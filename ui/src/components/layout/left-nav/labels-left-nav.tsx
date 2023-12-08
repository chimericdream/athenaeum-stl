import LabelIcon from '@mui/icons-material/Label';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const LabelsLeftNav = () => {
    const pathname = usePathname();

    return (
        <List>
            <ListItemButton
                component={Link}
                href="/labels"
                selected={pathname === '/labels'}
            >
                <ListItemIcon>
                    <LabelIcon />
                </ListItemIcon>
                <ListItemText primary="Labels" />
            </ListItemButton>
        </List>
    );
};
