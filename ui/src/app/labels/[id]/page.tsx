import { Box } from '@mui/material';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';

import { LabelDetails } from '~/components/labels/label-details';
import { LabelPageTitle } from '~/components/labels/label-page-title';
import { loadLabel } from '~/services/athenaeum';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { id } = params;
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['labels', id],
        queryFn: () => loadLabel(id),
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
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Box component="div">
                    <LabelPageTitle id={id} />
                </Box>
                <LabelDetails id={id} />
            </HydrationBoundary>
        </Box>
    );
}
