import { Box } from '@mui/material';
import type { Metadata } from 'next';

import { ModelList } from '~/components/models/model-list';
import { PageTitle } from '~/components/typography/page-title';

export const metadata: Metadata = {
    title: 'All Models',
};

export default async function Page() {
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
            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            >
                <ModelList />
            </Box>
        </Box>
    );
}
