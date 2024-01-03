'use client';

import { Box, Card, CardContent, Modal } from '@mui/material';

import { useFileRecordContext } from '~/components/models/files/file-record-context';
import { FileDetails } from '~/components/models/files/modals/file-details';

export const NonPreviewModal = ({ selected }: { selected: boolean }) => {
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
                    gridTemplateColumns: '1fr minmax(min-content, 33%) 1fr',
                    gridTemplateRows: '1fr minmax(min-content, 40%) 2fr',
                    height: '100%',
                }}
                onClick={deselect}
            >
                <Card
                    sx={{ gridArea: 'card' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <CardContent sx={{ height: '100%', maxHeight: '40vh' }}>
                        <Box component="div" sx={{ padding: 2 }}>
                            <FileDetails file={file} />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};
