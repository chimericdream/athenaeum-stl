import { Box, Divider } from '@mui/material';

import { FlagToggles } from '~/components/models/files/modals/controls/flag-toggles';
import { RotationButtons } from '~/components/models/files/modals/controls/rotation-buttons';
import { ScaleSlider } from '~/components/models/files/modals/controls/scale-slider';
import { FileCategory, type FileRecord } from '~/services/athenaeum';

export const PreviewControls = ({ file }: { file: FileRecord }) => {
    const hasControls =
        file.category === FileCategory.PART ||
        file.category === FileCategory.PROJECT;

    if (!hasControls) {
        return null;
    }

    return (
        <>
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <ScaleSlider />
                <RotationButtons />
            </Box>
            <Divider sx={{ marginBlock: '1rem' }} />
            <FlagToggles />
        </>
    );
};
