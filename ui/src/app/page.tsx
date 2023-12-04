'use client';

import Grid from '@mui/material/Unstable_Grid2';

import { ContentArea } from '~/components/layout/content-area';
import { ModelList } from '~/components/models/model-list';

export default function Page() {
    return (
        <ContentArea xs={12} sm={6} md={8} xl={9}>
            <Grid xs={12}>
                <ModelList />
            </Grid>
        </ContentArea>
    );
}
