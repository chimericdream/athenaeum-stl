'use client';

import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { loadLabels } from '~/services/athenaeum';

export const LabelList = () => {
    const { data } = useQuery({ queryKey: ['labels'], queryFn: loadLabels });
    const labels = data ?? [];

    return (
        <Box component="div" sx={{ pl: 3 }}>
            <pre>
                <code>{JSON.stringify(labels, null, 4)}</code>
            </pre>
        </Box>
    );
};
