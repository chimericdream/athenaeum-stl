import MenuIcon from '@mui/icons-material/Menu';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import Link from 'next/link';

interface NavbarProps {
    toggleLeftNav: () => void;
}

export default function Navbar({ toggleLeftNav }: NavbarProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    return (
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
    );
}
