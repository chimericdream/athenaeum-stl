import { Box } from '@mui/material';

import { AddLabelInput } from '~/components/labels/add-label-input';
import { LabelList } from '~/components/labels/label-list';
import { PageTitle } from '~/components/typography/page-title';

export default async function Page() {
    return (
        <Box component="div" sx={{ padding: '1rem', width: '100%' }}>
            <Box component="div">
                <PageTitle title="All Labels" />
            </Box>
            <Box
                component="div"
                sx={{
                    margin: '1rem 0 0.5rem 0',
                    width: { xs: '100%', sm: '50%', md: '33%' },
                }}
            >
                <AddLabelInput />
            </Box>
            <LabelList />
        </Box>
    );
}
