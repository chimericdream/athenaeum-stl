'use client';

import AbcIcon from '@mui/icons-material/Abc';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LabelIcon from '@mui/icons-material/Label';
import LabelOffIcon from '@mui/icons-material/LabelOff';
import NoAdultContentIcon from '@mui/icons-material/NoAdultContent';
import StraightIcon from '@mui/icons-material/Straight';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';

import { StackedIcon } from '~/components/icons/stacked-icon';
import { useModelListContext } from '~/contexts/model-list-context';

export const ListSidebarToggles = () => {
    const {
        includeNsfw,
        labelState,
        order,
        sort,
        handleSortOrderChange,
        handleLabelStateChange,
        toggleNsfw,
    } = useModelListContext();

    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                paddingTop: '1.5rem',
            }}
        >
            <Box component="div" sx={{ padding: '0 1rem' }}>
                <Typography>Sort list</Typography>
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
            </Box>

            <Box component="div" sx={{ padding: '0 1rem' }}>
                <Typography>With or without labels</Typography>
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
            </Box>

            <Box component="div" sx={{ padding: '0 1rem' }}>
                <Typography>Hide NSFW</Typography>
                <ToggleButton
                    value="nsfw"
                    selected={!includeNsfw}
                    onClick={toggleNsfw}
                >
                    <NoAdultContentIcon />
                </ToggleButton>
            </Box>
        </Box>
    );
};
