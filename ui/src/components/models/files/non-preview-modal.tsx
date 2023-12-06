'use client';

import { Box, Card, CardContent, Modal, Typography } from '@mui/material';
import { filesize } from 'filesize';

import { useFileRecordContext } from '~/components/models/files/file-record-context';

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
                        <Box sx={{ padding: 2 }}>
                            <Typography variant="body1" textOverflow="ellipsis">
                                {file.name}
                            </Typography>
                            <Typography variant="body2">
                                {file.file_size
                                    ? filesize(file.file_size, {
                                          round: 1,
                                      })
                                    : null}
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};
