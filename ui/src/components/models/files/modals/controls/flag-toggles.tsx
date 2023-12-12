'use client';

import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';

import { ThreeDimAxes } from '~/components/icons/three-dim-axes';
import { useModelPreviewContext } from '~/contexts/model-preview-context';

export const FlagToggles = () => {
    const { flags, updateFlags } = useModelPreviewContext();

    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
            }}
        >
            <ToggleButtonGroup
                value={flags}
                onChange={updateFlags}
                aria-label="Preview settings toggle buttons"
            >
                <ToggleButton value="showAxes" title="Show Axes">
                    <ThreeDimAxes />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
};
