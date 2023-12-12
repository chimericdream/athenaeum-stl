'use client';

import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { Box, Slider, Typography } from '@mui/material';
import type { SyntheticEvent } from 'react';

import { NumberInput } from '~/components/forms/number-input';
import { useModelPreviewContext } from '~/contexts/model-preview-context';

export const ScaleSlider = () => {
    const { settings, updateSettings } = useModelPreviewContext();

    const updateScale = (scale?: number) => {
        if (scale && scale > 0 && scale <= 100) {
            updateSettings({ ...settings, scale });
        }
    };

    const handleInputChange = (_: SyntheticEvent, val: number | undefined) => {
        updateScale(val);
    };

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        updateScale(newValue as number);
    };

    return (
        <Box component="div">
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{ width: '40%' }}>Scale</Typography>
                <Box component="div" sx={{ maxWidth: '60%' }}>
                    <NumberInput
                        value={settings.scale}
                        onChange={handleInputChange}
                    />
                </Box>
            </Box>
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    alignItems: 'center',
                }}
            >
                <ZoomInIcon />
                <Box component="div" sx={{ flexGrow: 1 }}>
                    <Slider
                        value={settings.scale}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                    />
                </Box>
                <ZoomOutIcon />
            </Box>
        </Box>
    );
};
