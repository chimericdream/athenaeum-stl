'use client';

import { Box } from '@mui/material';

import { useModelList } from '~/hooks/models/use-model-list';

import { ModelGrid } from './model-list/grid';
import { ModelTable } from './model-list/table';

export const ModelList = (props: { tableHeight?: string }) => {
    const { models, settings } = useModelList();
    const { mode } = settings;

    const tableHeight = props.tableHeight || 'calc(100vh - 13.75rem)';

    return (
        <Box component="div">
            {mode === 'grid' && <ModelGrid models={models} />}
            {mode === 'list' && (
                <ModelTable models={models} tableHeight={tableHeight} />
            )}
        </Box>
    );
};
