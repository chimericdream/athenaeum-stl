import { Box } from '@mui/material';
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';

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
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                padding: '1rem',
                width: '100%',
            }}
        >
            <Box component="div">
                <PageTitle title="All Models" />
            </Box>
            <Box component="div">
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ModelList />
                </HydrationBoundary>
            </Box>
        </Box>
    );
}
