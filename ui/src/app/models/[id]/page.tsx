import { Box } from '@mui/material';
import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';

import { ModelDetails } from '~/components/models/model-details';
import { ModelLabels } from '~/components/models/model-labels';
import { ModelMeta } from '~/components/models/model-metadata';
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
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: '1rem',
                overflow: 'hidden',
                padding: '1rem',
                width: '100%',
            }}
        >
            <HydrationBoundary state={dehydrate(queryClient)}>
                <Box component="div">
                    <ModelPageTitle id={id} />
                </Box>
                <Box
                    component="div"
                    sx={{ display: 'flex', flexGrow: 1, gap: '1rem' }}
                >
                    <Box component="div" sx={{ flexGrow: 1 }}>
                        <ModelDetails id={id} />
                    </Box>
                    <Box
                        component="div"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'start',
                            gap: '4rem',
                            borderLeft: {
                                xs: 0,
                                sm: '1px solid rgba(255, 255, 255, 0.12)',
                            },
                            paddingLeft: {
                                xs: 0,
                                sm: '1rem',
                            },
                            width: {
                                xs: '100%',
                                sm: 'calc(33% - 1px)',
                            },
                        }}
                    >
                        <Box component="div">
                            <ModelLabels id={id} />
                        </Box>
                        <Box component="div">
                            <ModelMeta id={id} />
                        </Box>
                    </Box>
                </Box>
            </HydrationBoundary>
        </Box>
    );
}
