import { Box } from '@mui/material';

import { LabelDetails } from '~/components/labels/label-details';
import { LabelPageTitle } from '~/components/labels/label-page-title';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function Page({ params }: PageProps) {
    const { id } = params;

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
                <LabelPageTitle id={id} />
            </Box>
            <LabelDetails id={id} />
        </Box>
    );
}
