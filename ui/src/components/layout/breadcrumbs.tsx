import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

export interface Breadcrumb {
    label: string;
    href: string;
}

export const Breadcrumbs = ({ crumbs }: { crumbs: Breadcrumb[] }) => {
    if (crumbs.length < 2) {
        return null;
    }

    const breadcrumbs = [...crumbs];
    const last = breadcrumbs.pop()!;

    return (
        <MuiBreadcrumbs separator={<ChevronRightIcon />} sx={{ mt: 1, mb: 2 }}>
            {breadcrumbs.map((crumb, index) => (
                <Link
                    key={crumb.href}
                    href={crumb.href}
                    component={NextLink}
                    color="primary"
                >
                    {crumb.label}
                </Link>
            ))}
            <Typography color="text.primary">{last.label}</Typography>
        </MuiBreadcrumbs>
    );
};