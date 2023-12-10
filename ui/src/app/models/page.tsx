import Grid from '@mui/material/Unstable_Grid2';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

import { ContentArea } from '~/components/layout/content-area';
import { ModelList } from '~/components/models/model-list';
import { PageTitle } from '~/components/typography/page-title';
import { loadModels } from '~/services/athenaeum';

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['models'],
        queryFn: loadModels,
    });

    return (
        <ContentArea xs={12}>
            <Grid xs={12} sx={{ pl: 3, pb: 0 }}>
                <PageTitle title="All Models" />
            </Grid>
            <Grid xs={12} sx={{ pt: 0 }}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ModelList />
                </HydrationBoundary>
            </Grid>
        </ContentArea>
    );
}
