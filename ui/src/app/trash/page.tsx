import { Box } from '@mui/material';

import { DeletedModelList } from '~/components/models/deleted-model-list';
import { PageTitle } from '~/components/typography/page-title';

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
                <PageTitle title="Trash can" />
            </Box>
            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            >
                <DeletedModelList />
            </Box>
        </Box>
    );
}
