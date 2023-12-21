'use client';

import AbcIcon from '@mui/icons-material/Abc';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GridViewIcon from '@mui/icons-material/GridView';
import LabelIcon from '@mui/icons-material/Label';
import LabelOffIcon from '@mui/icons-material/LabelOff';
import NoAdultContentIcon from '@mui/icons-material/NoAdultContent';
import StraightIcon from '@mui/icons-material/Straight';
import ViewListIcon from '@mui/icons-material/ViewList';
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { RefreshIcon } from '~/components/icons/refresh';
import { StackedIcon } from '~/components/icons/stacked-icon';
import { useModelListContext } from '~/contexts/model-list-context';

export const ModelListToggleButtons = () => {
    const [isReloading, setIsReloading] = useState(false);

    const queryClient = useQueryClient();

    const reloadModels = useCallback(async () => {
        setIsReloading(true);
        await queryClient.invalidateQueries({ queryKey: ['models'] });
        setTimeout(() => setIsReloading(false), 1000);
    }, [queryClient, setIsReloading]);

    const {
        includeNsfw,
        labelState,
        mode,
        order,
        sort,
        handleModeChange,
        handleSortOrderChange,
        handleLabelStateChange,
        toggleNsfw,
    } = useModelListContext();

    return (
        <>
            <Box component="div" sx={{ display: 'flex', gap: 2 }}>
                <ToggleButtonGroup
                    exclusive
                    aria-label="Toggle label state"
                    onChange={handleLabelStateChange}
                    value={labelState}
                >
                    <ToggleButton value="all">
                        <AllInclusiveIcon />
                    </ToggleButton>
                    <ToggleButton value="labeled">
                        <LabelIcon />
                    </ToggleButton>
                    <ToggleButton value="unlabeled">
                        <LabelOffIcon />
                    </ToggleButton>
                </ToggleButtonGroup>

                <ToggleButton
                    value="nsfw"
                    selected={!includeNsfw}
                    onClick={toggleNsfw}
                >
                    <NoAdultContentIcon />
                </ToggleButton>

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
                    <ToggleButton value="date|asc">
                        <StackedIcon>
                            <StraightIcon
                                sx={{
                                    transform: 'translateX(-0.25lh)',
                                }}
                            />
                            <CalendarMonthIcon
                                sx={{ transform: 'translateX(0.125lh)' }}
                            />
                        </StackedIcon>
                    </ToggleButton>
                    <ToggleButton value="date|desc">
                        <StackedIcon>
                            <StraightIcon
                                sx={{
                                    transform:
                                        'rotate(180deg) translateX(0.25lh)',
                                }}
                            />
                            <CalendarMonthIcon
                                sx={{ transform: 'translateX(0.125lh)' }}
                            />
                        </StackedIcon>
                    </ToggleButton>
                </ToggleButtonGroup>

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
