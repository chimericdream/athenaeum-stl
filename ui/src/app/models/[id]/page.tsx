import Grid from '@mui/material/Unstable_Grid2';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

import { ContentArea } from '~/components/layout/content-area';
import { ModelDetails } from '~/components/models/model-details';
import { loadModel } from '~/services/athenaeum';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { id } = params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    return (
        <ContentArea xs={12} sm={6} md={8} xl={9}>
            <Grid xs={12}>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ModelDetails id={id} />
                </HydrationBoundary>
            </Grid>
        </ContentArea>
    );
}
