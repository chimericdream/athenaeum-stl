'use client';

import AbcIcon from '@mui/icons-material/Abc';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import GridViewIcon from '@mui/icons-material/GridView';
import ImageIcon from '@mui/icons-material/Image';
import LabelIcon from '@mui/icons-material/Label';
import LayersIcon from '@mui/icons-material/Layers';
import LinkIcon from '@mui/icons-material/Link';
import NoAdultContentIcon from '@mui/icons-material/NoAdultContent';
import ReplayIcon from '@mui/icons-material/Replay';
import StraightIcon from '@mui/icons-material/Straight';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ViewListIcon from '@mui/icons-material/ViewList';
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
import { ListFilterInput } from '~/components/models/model-list/list-filter-input';
import { useModelListContext } from '~/contexts/model-list-context';

export const ListSidebarToggles = () => {
    const theme = useTheme();

    const {
        mode,
        handleModeChange,
        includeNsfw,
        labelState,
        order,
        sort,
        fileFilters,
        fileFilterUpdaters,
        handleSortOrderChange,
        handleLabelStateChange,
        handleNsfwChange,
        withLink,
        handleWithLinkChange,
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
                    Reset
                </Button>
            </Box>

            <Box component="div" sx={{ display: 'flex', padding: '0 1rem' }}>
                <ToggleButtonGroup
                    exclusive
                    aria-label="Toggle between list and grid views"
                    onChange={handleModeChange}
                    value={mode}
                    sx={{ width: '100%' }}
                >
                    <ToggleButton
                        value="list"
                        sx={{ display: 'flex', gap: 2, width: '50%' }}
                    >
                        <ViewListIcon />
                        <Typography>List view</Typography>
                    </ToggleButton>
                    <ToggleButton
                        value="grid"
                        sx={{ display: 'flex', gap: 2, width: '50%' }}
                    >
                        <GridViewIcon />
                        <Typography>Grid view</Typography>
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Box component="div" sx={{ display: 'flex', padding: '0 1rem' }}>
                <ListFilterInput />
            </Box>

            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <List sx={{ paddingBlock: 0 }}>
                    <ListItem sx={{ paddingTop: 0 }}>
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
                    aria-label="Toggle sort mode"
                    onChange={handleSortOrderChange}
                    value={`${sort}|${order}`}
                    sx={{
                        display: 'flex',
                        padding: '0 1rem',
                    }}
                >
                    <ToggleButton value="name|asc" sx={{ flex: 1 }}>
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
                    <ToggleButton value="name|desc" sx={{ flex: 1 }}>
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
                    <ToggleButton value="date|asc" sx={{ flex: 1 }}>
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
                    <ToggleButton value="date|desc" sx={{ flex: 1 }}>
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

            <Box
                component="div"
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <List sx={{ paddingBlock: 0 }}>
                    <ListItem sx={{ paddingTop: 0 }}>
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
                    <ListItem sx={{ paddingTop: 0 }}>
                        <ListItemText
                            primary="Other"
                            primaryTypographyProps={{
                                sx: { fontWeight: 'bold' },
                            }}
                        />
                    </ListItem>
                </List>
                <List sx={{ paddingTop: 0 }}>
                    <ListItem
                        sx={{
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            borderTop: `1px solid ${theme.palette.divider}`,
                        }}
                        secondaryAction={
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                value={withLink}
                                onChange={handleWithLinkChange}
                                aria-label="With source URL filter"
                            >
                                <ToggleButton
                                    value="include"
                                    aria-label="With source URL"
                                >
                                    <CheckIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="exclude"
                                    aria-label="Without source URL"
                                >
                                    <CloseIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="any"
                                    aria-label="With or without source URL"
                                >
                                    <AllInclusiveIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        }
                    >
                        <ListItemIcon sx={{ minWidth: '3rem' }}>
                            <LinkIcon />
                        </ListItemIcon>
                        <ListItemText primary="Has source URL" />
                    </ListItem>
                    <ListItem
                        sx={{
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                        secondaryAction={
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                value={labelState}
                                onChange={handleLabelStateChange}
                                aria-label="With label filter"
                            >
                                <ToggleButton
                                    value="labeled"
                                    aria-label="With source URL"
                                >
                                    <CheckIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="unlabeled"
                                    aria-label="Without source URL"
                                >
                                    <CloseIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="all"
                                    aria-label="With or without labels"
                                >
                                    <AllInclusiveIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        }
                    >
                        <ListItemIcon sx={{ minWidth: '3rem' }}>
                            <LabelIcon />
                        </ListItemIcon>
                        <ListItemText primary="With labels" />
                    </ListItem>
                    <ListItem
                        sx={{
                            borderBottom: `1px solid ${theme.palette.divider}`,
                        }}
                        secondaryAction={
                            <ToggleButtonGroup
                                exclusive
                                size="small"
                                value={includeNsfw}
                                onChange={handleNsfwChange}
                                aria-label="With label filter"
                            >
                                <ToggleButton
                                    value={true}
                                    aria-label="Only NSFW models"
                                >
                                    <CheckIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value={false}
                                    aria-label="Exclude NSFW models"
                                >
                                    <CloseIcon />
                                </ToggleButton>
                                <ToggleButton
                                    value="null"
                                    selected={includeNsfw === null}
                                    aria-label="All models"
                                >
                                    <AllInclusiveIcon />
                                </ToggleButton>
                            </ToggleButtonGroup>
                        }
                    >
                        <ListItemIcon sx={{ minWidth: '3rem' }}>
                            <NoAdultContentIcon />
                        </ListItemIcon>
                        <ListItemText primary="NSFW" />
                    </ListItem>
                </List>
            </Box>
        </Box>
    );
};
