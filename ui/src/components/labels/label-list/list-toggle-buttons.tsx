'use client';

import AbcIcon from '@mui/icons-material/Abc';
import NumbersIcon from '@mui/icons-material/Numbers';
import StraightIcon from '@mui/icons-material/Straight';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { RefreshIcon } from '~/components/icons/refresh';
import { StackedIcon } from '~/components/icons/stacked-icon';
import { useLabelListContext } from '~/contexts/label-list-context';

export const LabelListToggleButtons = () => {
    const [isReloading, setIsReloading] = useState(false);

    const queryClient = useQueryClient();

    const reloadModels = useCallback(async () => {
        setIsReloading(true);
        await queryClient.invalidateQueries({ queryKey: ['models'] });
        setTimeout(() => setIsReloading(false), 1000);
    }, [queryClient, setIsReloading]);

    const { order, sort, handleSortOrderChange } = useLabelListContext();

    return (
        <>
            <Box component="div" sx={{ display: 'flex', gap: 2 }}>
                <ToggleButtonGroup
                    exclusive
                    aria-label="Toggle sort mode"
                    onChange={handleSortOrderChange}
                    value={`${sort}|${order}`}
                >
                    <ToggleButton value="name|asc">
                        <StackedIcon>
                            <StraightIcon
                                sx={{
                                    transform: 'translateX(-0.25lh)',
                                }}
                            />
                            <AbcIcon
                                sx={{ transform: 'translateX(0.125lh)' }}
                            />
                        </StackedIcon>
                    </ToggleButton>
                    <ToggleButton value="name|desc">
                        <StackedIcon>
                            <StraightIcon
                                sx={{
                                    transform:
                                        'rotate(180deg) translateX(0.25lh)',
                                }}
                            />
                            <AbcIcon
                                sx={{ transform: 'translateX(0.125lh)' }}
                            />
                        </StackedIcon>
                    </ToggleButton>
                    <ToggleButton value="model_count|asc">
                        <StackedIcon>
                            <StraightIcon
                                sx={{
                                    transform: 'translateX(-0.25lh)',
                                }}
                            />
                            <NumbersIcon
                                sx={{ transform: 'translateX(0.125lh)' }}
                            />
                        </StackedIcon>
                    </ToggleButton>
                    <ToggleButton value="model_count|desc">
                        <StackedIcon>
                            <StraightIcon
                                sx={{
                                    transform:
                                        'rotate(180deg) translateX(0.25lh)',
                                }}
                            />
                            <NumbersIcon
                                sx={{ transform: 'translateX(0.125lh)' }}
                            />
                        </StackedIcon>
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
