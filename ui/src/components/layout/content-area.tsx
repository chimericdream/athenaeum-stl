import Grid from '@mui/material/Unstable_Grid2';
import type { GridDefaultBreakpoints } from '@mui/system';
import type { PropsWithChildren as PWC } from 'react';

interface ContentAreaProps extends GridDefaultBreakpoints {}

export default function ContentArea({
    children,
    ...props
}: PWC<ContentAreaProps>) {
    return (
        <Grid
            {...props}
            container
            spacing={3}
            sx={{ alignContent: 'start', m: 0, p: 0 }}
        >
            {children}
        </Grid>
    );
}
