'use client';

import { Box } from '@mui/material';

import { useModelList } from '~/hooks/models/use-model-list';

import { DeletedModelTable } from './model-list/deleted-table';

export const DeletedModelList = (props: { tableHeight?: string }) => {
    const { models } = useModelList({
        mode: 'list',
        order: 'asc',
        sort: 'name',
        includeNsfw: null,
        isDeleted: true,
    });

    const tableHeight = props.tableHeight || 'calc(100vh - 13.75rem)';

    return (
        <Box component="div">
            <DeletedModelTable models={models} tableHeight={tableHeight} />
        </Box>
    );
};
