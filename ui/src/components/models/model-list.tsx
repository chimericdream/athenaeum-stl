'use client';

import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, type MouseEvent } from 'react';

import { RefreshIcon } from '~/components/icons/refresh';
import { loadModels } from '~/services/athenaeum';

import { ModelGrid } from './model-list/grid';
import { ModelTable } from './model-list/table';

export const ModelList = () => {
    const queryClient = useQueryClient();
    const [mode, setMode] = useState<'grid' | 'list'>('list');

    const [isReloading, setIsReloading] = useState(false);

    const reloadModels = useCallback(async () => {
        setIsReloading(true);
        await queryClient.invalidateQueries({ queryKey: ['models'] });
        setTimeout(() => setIsReloading(false), 1000);
    }, [queryClient, setIsReloading]);

    const handleModeChange = useCallback(
        (_: MouseEvent<HTMLElement>, newMode: 'grid' | 'list') => {
            setMode(newMode);
        },
        [setMode]
    );

    const { data } = useQuery({ queryKey: ['models'], queryFn: loadModels });
    const models = data ?? [];

    const toggleButtons = (
        <Box component="div" sx={{ display: 'flex', gap: 2 }}>
            <ToggleButton
                value="reload"
                selected={isReloading}
                onClick={reloadModels}
            >
                <RefreshIcon isRotating={isReloading} />
            </ToggleButton>

            <ToggleButtonGroup
                exclusive
                aria-label="Toggle between list and grid views"
                onChange={handleModeChange}
                value={mode}
            >
                <ToggleButton value="list" title="View as list">
                    <ViewListIcon />
                </ToggleButton>
                <ToggleButton value="grid" title="View as grid">
                    <GridViewIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );

    return (
        <Box component="div">
            {mode === 'grid' && (
                <ModelGrid models={models} toggleButtons={toggleButtons} />
            )}
            {mode === 'list' && (
                <ModelTable models={models} toggleButtons={toggleButtons} />
            )}
        </Box>
    );
};
