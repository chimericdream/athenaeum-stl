'use client';

import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { RefreshIcon } from '~/components/icons/refresh';
import { useModelListContext } from '~/contexts/model-list-context';

export const ModelListToggleButtons = () => {
    const [isReloading, setIsReloading] = useState(false);

    const queryClient = useQueryClient();

    const reloadModels = useCallback(async () => {
        setIsReloading(true);
        await queryClient.invalidateQueries({ queryKey: ['models'] });
        setTimeout(() => setIsReloading(false), 1000);
    }, [queryClient, setIsReloading]);

    const { mode, handleModeChange } = useModelListContext();

    return (
        <>
            <Box component="div" sx={{ display: 'flex', gap: 2 }}>
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

                <ToggleButton
                    value="reload"
                    selected={isReloading}
                    onClick={reloadModels}
                >
                    <RefreshIcon isRotating={isReloading} />
                </ToggleButton>
            </Box>
        </>
    );
};
