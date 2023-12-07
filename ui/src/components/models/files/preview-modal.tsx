'use client';

import { Box, Card, CardContent, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { filesize } from 'filesize';

import { useFileRecordContext } from '~/components/models/files/file-record-context';
import { ImagePreview } from '~/components/models/files/preview/image';
import { PartPreview } from '~/components/models/files/preview/part';
import { TextPreview } from '~/components/models/files/preview/txt';
import { FileCategory } from '~/services/athenaeum';

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
                            gridTemplateColumns: '3fr 1fr',
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
                            {file.category === FileCategory.IMAGE && (
                                <ImagePreview file={file} />
                            )}
                            {file.category === FileCategory.PART && (
                                <PartPreview file={file} />
                            )}
                            {/*{file.category === FileCategory.PART && (*/}
                            {/*    <PartPreview file={file} />*/}
                            {/*)}*/}
                            {file.category === FileCategory.SUPPORT && (
                                <TextPreview file={file} />
                            )}
                        </Box>
                        <Box
                            component="div"
                            sx={{
                                borderLeft: `1px solid ${theme.palette.grey[800]}`,
                                gridArea: 'sidebar',
                                padding: 2,
                            }}
                        >
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
