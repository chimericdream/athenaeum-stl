import Grid from '@mui/material/Unstable_Grid2';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

import { ContentArea } from '~/components/layout/content-area';
import { ModelList } from '~/components/models/model-list';
import { loadModels } from '~/services/athenaeum';

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['models'],
        queryFn: loadModels,
    });

    return (
        <ContentArea xs={12} sm={6} md={8} xl={9}>
            <Grid xs={12}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ModelList />
                </HydrationBoundary>
            </Grid>
        </ContentArea>
    );
}