import Grid from '@mui/material/Unstable_Grid2';

import { ContentArea } from '~/components/layout/content-area';

export default async function Page() {
    return (
        <ContentArea xs={12} sm={6} md={8} xl={9}>
            <Grid xs={12}>Home</Grid>
        </ContentArea>
    );
}
