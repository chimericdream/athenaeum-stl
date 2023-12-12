'use client';

import { Box, Card, CardContent, Modal } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useFileRecordContext } from '~/components/models/files/file-record-context';
import { FileDetails } from '~/components/models/files/modals/file-details';
import { FilePreview } from '~/components/models/files/modals/file-preview';
import { PreviewControls } from '~/components/models/files/modals/preview-controls';

export const PreviewModal = ({ selected }: { selected: boolean }) => {
    const theme = useTheme();
    const { file, deselect } = useFileRecordContext();

    if (!selected) {
        return null;
    }

    return (
        <Modal
            open
            onClose={deselect}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                component="div"
                sx={{
                    display: 'grid',
                    gridTemplateAreas: '". . ." ". card ." ". . ."',
                    gridTemplateColumns: '1fr minmax(min-content, 80%) 1fr',
                    gridTemplateRows: '1fr minmax(min-content, 80%) 2fr',
                    height: '100%',
                }}
                onClick={deselect}
            >
                <Card
                    sx={{ gridArea: 'card' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <CardContent
                        sx={{
                            display: 'grid',
                            gap: '1rem',
                            gridTemplateAreas: '"preview sidebar"',
                            gridTemplateColumns: '5fr 2fr',
                            height: '100%',
                            maxHeight: '80vh',
                        }}
                    >
                        <Box
                            component="div"
                            sx={{
                                gridArea: 'preview',
                                height: '100%',
                                overflow: 'hidden',
                                position: 'relative',
                            }}
                        >
                            <FilePreview file={file} />
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                borderLeft: `1px solid ${theme.palette.grey[800]}`,
                                gridArea: 'sidebar',
                                padding: 2,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box component="div" sx={{ flexGrow: 1 }}>
                                <FileDetails file={file} />
                            </Box>
                            <Box component="div">
                                <PreviewControls file={file} />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};
