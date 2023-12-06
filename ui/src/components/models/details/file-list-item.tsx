'use client';

import DownloadIcon from '@mui/icons-material/Download';
import PreviewIcon from '@mui/icons-material/Preview';
import {
    Box,
    Card,
    CardContent,
    ListItemButton,
    ListItemText,
    Modal,
    Typography,
} from '@mui/material';
import { filesize } from 'filesize';
import Image from 'next/image';
import { useCallback, useState } from 'react';

import {
    FileCategory,
    FileRecord,
    getDownloadUrl,
    getStaticUrl,
} from '~/services/athenaeum';

export const FileListItem = ({ file }: { file: FileRecord }) => {
    const [open, setOpen] = useState(false);
    const toggleModal = useCallback(() => setOpen((prev) => !prev), [setOpen]);

    const canPreview =
        file.category === FileCategory.IMAGE ||
        file.category === FileCategory.PART ||
        (file.category === FileCategory.SUPPORT_FILE &&
            file.file_name.endsWith('txt'));

    const handleClick = useCallback(() => {
        if (canPreview) {
            toggleModal();
        } else {
            const url = getDownloadUrl(file);
            window.open(url);
        }
    }, [canPreview, file, toggleModal]);

    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemText
                    primary={file.name}
                    secondary={
                        file.file_size
                            ? filesize(file.file_size, { round: 1 })
                            : null
                    }
                />
                {canPreview ? <PreviewIcon /> : <DownloadIcon />}
            </ListItemButton>
            <Modal
                open={open}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateAreas: '". . ." ". card ." ". . ."',
                        gridTemplateColumns: '1fr minmax(min-content, 80%) 1fr',
                        gridTemplateRows: '1fr minmax(min-content, 80%) 2fr',
                        height: '100%',
                    }}
                    onClick={toggleModal}
                >
                    <Card
                        sx={{
                            gridArea: 'card',
                            minWidth: 275,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <CardContent
                            sx={{
                                display: 'grid',
                                gap: '1rem',
                                gridTemplateAreas: '"preview sidebar"',
                                gridTemplateColumns: '3fr 1fr',
                                height: '100%',
                            }}
                        >
                            <Box
                                sx={{
                                    gridArea: 'preview',
                                    height: '100%',
                                    position: 'relative',
                                }}
                            >
                                <Image
                                    fill
                                    src={getStaticUrl(file)}
                                    alt={file.name}
                                    style={{
                                        objectFit: 'contain',
                                        objectPosition: 'left top',
                                    }}
                                />
                            </Box>
                            <Box sx={{ gridArea: 'sidebar', padding: 2 }}>
                                <Typography
                                    variant="body1"
                                    textOverflow="ellipsis"
                                >
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
        </>
    );
};
