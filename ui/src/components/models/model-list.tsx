'use client';

import { Box } from '@mui/material';

import { useModelList } from '~/hooks/models/use-model-list';

import { ModelGrid } from './model-list/grid';
import { ModelTable } from './model-list/table';

export const ModelList = () => {
    const { models, settings } = useModelList();
    const { mode } = settings;

    return (
        <Box component="div">
            {mode === 'grid' && <ModelGrid models={models} />}
            {mode === 'list' && <ModelTable models={models} />}
        </Box>
    );
};
