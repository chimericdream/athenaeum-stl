'use client';

import { ToggleButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { RefreshIcon } from '~/components/icons/refresh';

export const ModelListToggleButtons = () => {
    const [isReloading, setIsReloading] = useState(false);

    const queryClient = useQueryClient();

    const reloadModels = useCallback(async () => {
        setIsReloading(true);
        await queryClient.invalidateQueries({ queryKey: ['models'] });
        setTimeout(() => setIsReloading(false), 1000);
    }, [queryClient, setIsReloading]);

    return (
        <ToggleButton
            value="reload"
            selected={isReloading}
            onClick={reloadModels}
        >
            <RefreshIcon isRotating={isReloading} />
        </ToggleButton>
    );
};
