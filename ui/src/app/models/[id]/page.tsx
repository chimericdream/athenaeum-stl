import Grid from '@mui/material/Unstable_Grid2';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

import { ContentArea } from '~/components/layout/content-area';
import { ModelDetails } from '~/components/models/model-details';
import { ModelLabels } from '~/components/models/model-labels';
import { ModelPageTitle } from '~/components/models/model-page-title';
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
        <ContentArea xs={12}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Grid xs={12} sm={8}>
                    <ModelPageTitle id={id} />
                </Grid>
                <Grid xs={12} sm={8}>
                    <ModelDetails id={id} />
                </Grid>
                <Grid
                    xs={12}
                    sm={4}
                    sx={{
                        borderLeft: {
                            xs: 0,
                            sm: '1px solid rgba(255, 255, 255, 0.12)',
                        },
                        width: {
                            xs: 'calc(100% - 1px)',
                            sm: 'calc((100% * 4 / var(--Grid-columns)) - 1px)',
                        },
                    }}
                >
                    <ModelLabels id={id} />
                </Grid>
            </HydrationBoundary>
        </ContentArea>
    );
}
