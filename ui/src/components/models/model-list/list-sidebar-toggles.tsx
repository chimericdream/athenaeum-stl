'use client';

import AbcIcon from '@mui/icons-material/Abc';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import ImageIcon from '@mui/icons-material/Image';
import LabelIcon from '@mui/icons-material/Label';
import LabelOffIcon from '@mui/icons-material/LabelOff';
import LayersIcon from '@mui/icons-material/Layers';
import NoAdultContentIcon from '@mui/icons-material/NoAdultContent';
import ReplayIcon from '@mui/icons-material/Replay';
import StraightIcon from '@mui/icons-material/Straight';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import {
    Box,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { StackedIcon } from '~/components/icons/stacked-icon';
import { useModelListContext } from '~/contexts/model-list-context';

export const ListSidebarToggles = () => {
    const theme = useTheme();

    const {
        includeNsfw,
        labelState,
        order,
        sort,
        fileFilters,
        fileFilterUpdaters,
        handleSortOrderChange,
        handleLabelStateChange,
        toggleNsfw,
        reset,
    } = useModelListContext();

    return (
        <Box
            component="div"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
            <Box
                component="div"
                sx={{ display: 'flex', padding: '1rem 1rem 0 1rem' }}
            >
                <Button
                    color="warning"
                    variant="outlined"
                    startIcon={<ReplayIcon />}
                    sx={{
                        border: '1px solid #fff',
                        color: 'inherit',
                        flexGrow: 1,
                    }}
                    onClick={reset}
                >
                    Reset filters
                </Button>
            </Box>

            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <List sx={{ paddingBlock: 0 }}>
                    <ListItem>
                        <ListItemText
                            primary="Sort"
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
                <List sx={{ paddingBlock: 0 }}>
                    <ListItem>
                        <ListItemText
                            primary="Files"
                            primaryTypographyProps={{
                                sx: { fontWeight: 'bold' },
                            }}
                        />
                    </ListItem>
                    <ListItem
                        sx={{
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                        secondaryAction={
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                value={fileFilters.parts}
                                onChange={fileFilterUpdaters.parts}
                                aria-label="Part file filter"
                            >
                                <ToggleButton
                                    value="include"
                                    aria-label="With part files"
                                >
                                    <CheckIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="exclude"
                                    aria-label="Without part files"
                                >
                                    <CloseIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="any"
                                    aria-label="Any part files"
                                >
                                    <AllInclusiveIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        }
                    >
                        <ListItemIcon sx={{ minWidth: '3rem' }}>
                            <ViewInArIcon />
                        </ListItemIcon>
                        <ListItemText primary="Parts" />
                    </ListItem>
                    <ListItem
                        sx={{
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                        secondaryAction={
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                value={fileFilters.projects}
                                onChange={fileFilterUpdaters.projects}
                                aria-label="Project file filter"
                            >
                                <ToggleButton
                                    value="include"
                                    aria-label="With project files"
                                >
                                    <CheckIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="exclude"
                                    aria-label="Without project files"
                                >
                                    <CloseIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="any"
                                    aria-label="Any project files"
                                >
                                    <AllInclusiveIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        }
                    >
                        <ListItemIcon sx={{ minWidth: '3rem' }}>
                            <LayersIcon />
                        </ListItemIcon>
                        <ListItemText primary="Projects" />
                    </ListItem>
                    <ListItem
                        sx={{
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                        secondaryAction={
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                value={fileFilters.images}
                                onChange={fileFilterUpdaters.images}
                                aria-label="Image file filter"
                            >
                                <ToggleButton
                                    value="include"
                                    aria-label="With image files"
                                >
                                    <CheckIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="exclude"
                                    aria-label="Without image files"
                                >
                                    <CloseIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="any"
                                    aria-label="Any image files"
                                >
                                    <AllInclusiveIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        }
                    >
                        <ListItemIcon sx={{ minWidth: '3rem' }}>
                            <ImageIcon />
                        </ListItemIcon>
                        <ListItemText primary="Images" />
                    </ListItem>
                    <ListItem
                        sx={{
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                        secondaryAction={
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                value={fileFilters.supportFiles}
                                onChange={fileFilterUpdaters.supportFiles}
                                aria-label="Support file filter"
                            >
                                <ToggleButton
                                    value="include"
                                    aria-label="With support files"
                                >
                                    <CheckIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="exclude"
                                    aria-label="Without support files"
                                >
                                    <CloseIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="any"
                                    aria-label="Any support files"
                                >
                                    <AllInclusiveIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        }
                    >
                        <ListItemIcon sx={{ minWidth: '3rem' }}>
                            <FilePresentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Support files" />
                    </ListItem>
                </List>
            </Box>

            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <List sx={{ paddingBlock: 0 }}>
                    <ListItem>
                        <ListItemText
                            primary="Labels"
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
                        <Typography>All models</Typography>
                    </ToggleButton>
                    <ToggleButton value="labeled">
                        <LabelIcon />
                        <Typography>Models with labels</Typography>
                    </ToggleButton>
                    <ToggleButton value="unlabeled">
                        <LabelOffIcon />
                        <Typography>Models without labels</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <List sx={{ paddingBlock: 0 }}>
                    <ListItem>
                        <ListItemText
                            primary="Other"
                            primaryTypographyProps={{
                                sx: { fontWeight: 'bold' },
                            }}
                        />
                    </ListItem>
                </List>
                <ToggleButtonGroup
                    orientation="vertical"
                    onChange={() => {}}
                    value={[]}
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
                    <ToggleButton
                        value="nsfw"
                        selected={!includeNsfw}
                        onClick={toggleNsfw}
                    >
                        <NoAdultContentIcon />
                        <Typography>
                            {includeNsfw
                                ? 'Showing NSFW models'
                                : 'Hiding NSFW models'}
                        </Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>
        </Box>
    );
};
