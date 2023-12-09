import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

import { AddLabelInput } from '~/components/labels/add-label-input';
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
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Grid xs={12} sx={{ pl: 3 }}>
                    <Box
                        component="div"
                        sx={{ width: { xs: '100%', sm: '50%', md: '33%' } }}
                    >
                        <AddLabelInput />
                    </Box>
                </Grid>
                <Grid xs={12}>
                    <LabelList />
                </Grid>
            </HydrationBoundary>
        </ContentArea>
    );
}
