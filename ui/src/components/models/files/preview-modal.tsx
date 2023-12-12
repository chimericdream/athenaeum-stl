'use client';

import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import {
    Box,
    Card,
    CardContent,
    Modal,
    Slider,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { filesize } from 'filesize';
import type { SyntheticEvent } from 'react';

import { NumberInput } from '~/components/forms/number-input';
import { ThreeDimAxes } from '~/components/icons/three-dim-axes';
import { useFileRecordContext } from '~/components/models/files/file-record-context';
import { ImagePreview } from '~/components/models/files/preview/image';
import { PartPreview } from '~/components/models/files/preview/part';
import { TextPreview } from '~/components/models/files/preview/txt';
import { useModelPreviewContext } from '~/contexts/model-preview-context';
import { FileCategory } from '~/services/athenaeum';

export const PreviewModal = ({ selected }: { selected: boolean }) => {
    const theme = useTheme();
    const { file, deselect } = useFileRecordContext();
    const { flags, settings, updateFlags, updateSettings } =
        useModelPreviewContext();

    const updateScale = (newScale?: number) => {
        if (newScale && newScale > 0 && newScale <= 100) {
            updateSettings({ ...settings, scale: newScale });
        }
    };

    const handleInputChange = (
        event: SyntheticEvent,
        newValue: number | undefined
    ) => {
        updateScale(newValue);
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        updateScale(newValue as number);
    };

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
                            {/*{file.category === FileCategory.PROJECT && (*/}
                            {/*    <ProjectPreview file={file} />*/}
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
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box component="div" sx={{ flexGrow: 1 }}>
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
                            <Box
                                component="div"
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Typography>Scale</Typography>
                                <NumberInput
                                    value={settings.scale}
                                    onChange={handleInputChange}
                                />
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
                                    <ToggleButton
                                        value="showAxes"
                                        title="Show Axes"
                                    >
                                        <ThreeDimAxes />
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};
