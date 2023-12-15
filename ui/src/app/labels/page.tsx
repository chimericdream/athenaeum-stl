import { Box } from '@mui/material';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';

import { AddLabelInput } from '~/components/labels/add-label-input';
import { LabelList } from '~/components/labels/label-list';
import { PageTitle } from '~/components/typography/page-title';
import { loadLabels } from '~/services/athenaeum';

export default async function Page() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['labels'],
        queryFn: loadLabels,
    });

    return (
        <Box component="div" sx={{ padding: '1rem', width: '100%' }}>
            <Box component="div">
                <PageTitle title="All Labels" />
            </Box>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Box
                    component="div"
                    sx={{
                        marginBlock: '1rem',
                        width: { xs: '100%', sm: '50%', md: '33%' },
                    }}
                >
                    <AddLabelInput />
                </Box>
                <LabelList />
            </HydrationBoundary>
        </Box>
    );
}
