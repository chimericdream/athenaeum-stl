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
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <List sx={{ paddingBottom: 0 }}>
                    <ListItem>
                        <ListItemText
                            primary="Sort models"
                            primaryTypographyProps={{
                                sx: { fontWeight: 'bold' },
                            }}
                        />
                    </ListItem>
                </List>
                <ToggleButtonGroup
                    exclusive
                    orientation="vertical"
                    aria-label="Toggle sort mode"
                    onChange={handleSortOrderChange}
                    value={`${sort}|${order}`}
                    sx={{
                        '& > *': {
                            borderRadius: 0,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            justifyContent: 'flex-start',
                            paddingLeft: '1rem',
                            gap: 3,
                            textTransform: 'none',
                        },
                    }}
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
                        <Typography>Name (asc)</Typography>
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
                        <Typography>Name (desc)</Typography>
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
                        <Typography>Imported at (asc)</Typography>
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
                        <Typography>Imported at (desc)</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <List sx={{ paddingBottom: 0 }}>
                    <ListItem>
                        <ListItemText
                            primary="Models with labels"
                            primaryTypographyProps={{
                                sx: { fontWeight: 'bold' },
                            }}
                        />
                    </ListItem>
                </List>
                <ToggleButtonGroup
                    exclusive
                    orientation="vertical"
                    aria-label="Toggle label state"
                    onChange={handleLabelStateChange}
                    value={labelState}
                    sx={{
                        '& > *': {
                            borderRadius: 0,
                            borderLeftWidth: 0,
                            borderRightWidth: 0,
                            justifyContent: 'flex-start',
                            paddingLeft: '1rem',
                            gap: 3,
                            textTransform: 'none',
                        },
                    }}
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

            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <List sx={{ paddingBottom: 0 }}>
                    <ListItem>
                        <ListItemText
                            primary="Hide NSFW"
                            primaryTypographyProps={{
                                sx: { fontWeight: 'bold' },
                            }}
                        />
                    </ListItem>
                </List>
                <ToggleButton
                    value="nsfw"
                    selected={!includeNsfw}
                    onClick={toggleNsfw}
                    sx={{
                        borderRadius: 0,
                        borderLeftWidth: 0,
                        borderRightWidth: 0,
                        justifyContent: 'flex-start',
                        paddingLeft: '1rem',
                        gap: 3,
                        textTransform: 'none',
                    }}
                >
                    <NoAdultContentIcon />
                </ToggleButton>
            </Box>
        </Box>
    );
};
