'use client';

import { Box } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useModelListContext } from '~/contexts/model-list-context';
import { loadModels, type Model } from '~/services/athenaeum';

import { ModelGrid } from './model-list/grid';
import { ModelTable } from './model-list/table';

export const ModelList = () => {
    const { mode, order } = useModelListContext();

    const { data } = useQuery({ queryKey: ['models'], queryFn: loadModels });
    const models = useMemo(() => {
        const list = data ?? [];

        const sortFunc = (left: Model, right: Model) => {
            const result = left.name.localeCompare(right.name, 'en-US', {
                caseFirst: 'lower',
                numeric: true,
                sensitivity: 'base',
            });

            return order === 'asc' ? result : -1 * result;
        };

        if (mode === 'grid') {
            return list.toSorted(sortFunc);
        }

        return list.toSorted(sortFunc);
    }, [data, mode, order]);

    return (
        <Box component="div">
            {mode === 'grid' && <ModelGrid models={models} />}
            {mode === 'list' && <ModelTable models={models} />}
        </Box>
    );
};
