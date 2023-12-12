'use client';

import AdjustIcon from '@mui/icons-material/Adjust';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import UndoIcon from '@mui/icons-material/Undo';
import { Box, IconButton } from '@mui/material';

import { useModelPreviewContext } from '~/contexts/model-preview-context';

export const RotationButtons = () => {
    const { settings, updateSettings } = useModelPreviewContext();

    const rotate = (axis: 'x' | 'y' | 'z', direction: 1 | -1) => {
        updateSettings({
            ...settings,
            rotation: {
                ...settings.rotation,
                [axis]: (settings.rotation[axis] + direction) % 4,
            },
        });
    };

    const center = () => {
        updateSettings({ ...settings, rotation: { x: 0, y: 0, z: 0 } });
    };

    return (
        <Box
            component="div"
            sx={{
                display: 'grid',
                gridTemplateAreas:
                    '". . up . ." "ltilt left center right rtilt" ". . down . ."',
                gridTemplateColumns: '2.5rem',
                gridTemplateRows: '2.5rem',
            }}
        >
            <IconButton
                aria-label="up"
                sx={{ gridArea: 'up' }}
                onClick={() => rotate('x', 1)}
            >
                <KeyboardArrowUpIcon />
            </IconButton>
            <IconButton
                aria-label="rotate left"
                sx={{ gridArea: 'ltilt' }}
                onClick={() => rotate('z', -1)}
            >
                <UndoIcon sx={{ transform: 'rotate(-90deg)' }} />
            </IconButton>
            <IconButton
                aria-label="left"
                sx={{ gridArea: 'left' }}
                onClick={() => rotate('y', -1)}
            >
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
                aria-label="rotate right"
                sx={{ gridArea: 'rtilt' }}
                onClick={() => rotate('z', 1)}
            >
                <UndoIcon sx={{ transform: 'rotate(90deg) scaleX(-1)' }} />
            </IconButton>
            <IconButton
                aria-label="center"
                sx={{ gridArea: 'center' }}
                onClick={center}
            >
                <AdjustIcon />
            </IconButton>
            <IconButton
                aria-label="right"
                sx={{ gridArea: 'right' }}
                onClick={() => rotate('y', 1)}
            >
                <KeyboardArrowRightIcon />
            </IconButton>
            <IconButton
                aria-label="down"
                sx={{ gridArea: 'down' }}
                onClick={() => rotate('x', -1)}
            >
                <KeyboardArrowDownIcon />
            </IconButton>
        </Box>
    );
};
