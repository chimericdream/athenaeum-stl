import Grid from '@mui/material/Unstable_Grid2';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

import { LabelList } from '~/components/labels/label-list';
import { ContentArea } from '~/components/layout/content-area';
import { PageTitle } from '~/components/typography/page-title';
import { loadLabels } from '~/services/athenaeum';

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['labels'],
        queryFn: loadLabels,
    });

    return (
        <ContentArea xs={12}>
            <Grid xs={12} sx={{ pl: 3 }}>
                <PageTitle title="All Labels" />
            </Grid>
            <Grid xs={12}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <LabelList />
                </HydrationBoundary>
            </Grid>
        </ContentArea>
    );
}
