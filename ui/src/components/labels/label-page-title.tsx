'use client';

import { Box, ToggleButton, Typography } from '@mui/material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { RefreshIcon } from '~/components/icons/refresh';
import { type Breadcrumb, Breadcrumbs } from '~/components/layout/breadcrumbs';
import { loadLabel } from '~/services/athenaeum';

export const LabelPageTitle = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['labels', id],
        queryFn: () => loadLabel(id),
    });

    const [isReloading, setIsReloading] = useState(false);

    const reloadLabel = useCallback(async () => {
        setIsReloading(true);
        await queryClient.invalidateQueries({ queryKey: ['labels', id] });
        setTimeout(() => setIsReloading(false), 1000);
    }, [id, queryClient, setIsReloading]);

    const crumbs: Breadcrumb[] = [
        {
            label: 'Labels',
            href: '/labels',
        },
        {
            label: data?.name ?? 'Unknown label',
            href: `/labels/${id}`,
        },
    ];

    return (
        <>
            <Box component="div">
                <Box
                    component="div"
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexGrow: 1,
                        gap: 2,
                    }}
                >
                    <Typography variant="h4">
                        {data?.name ?? 'Unknown label'}
                    </Typography>
                    <ToggleButton
                        value="reload"
                        selected={isReloading}
                        onClick={reloadLabel}
                    >
                        <RefreshIcon isRotating={isReloading} />
                    </ToggleButton>
                </Box>
            </Box>
            <Breadcrumbs crumbs={crumbs} />
        </>
    );
};
