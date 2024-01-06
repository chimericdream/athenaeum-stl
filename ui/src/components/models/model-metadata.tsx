'use client';

import LaunchIcon from '@mui/icons-material/Launch';
import {
    Box,
    Button,
    Divider,
    FormControlLabel,
    Link,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import NextLink from 'next/link';
import { type ChangeEvent, useCallback, useEffect, useState } from 'react';

import { Markdownify } from '~/components/typography/markdownify';
import {
    type ModelMetadata,
    type ModelRecord,
    loadModel,
    updateModelMetadata,
} from '~/services/athenaeum';

export const ModelMeta = ({ id }: { id: string }) => {
    const [editMode, setEditMode] = useState(false);

    const queryClient = useQueryClient();
    const theme = useTheme();

    const { data: model } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    const metadata = model?.metadata;

    const [description, setDescription] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');

    const { isPending, mutate } = useMutation<
        ModelRecord,
        Error,
        { id: string; metadata: ModelMetadata }
    >({
        mutationFn: updateModelMetadata,
        onSuccess: (model) => {
            queryClient.setQueryData(['models', id], model);
            setEditMode(false);
        },
    });

    const handleSave = useCallback(() => {
        mutate({
            id,
            metadata: {
                model_id: id,
                description: description.trim(),
                source_url: sourceUrl.trim(),
                commercial_use: metadata?.commercial_use ?? false,
                nsfw: metadata?.nsfw ?? false,
            },
        });
    }, [mutate, id, description, sourceUrl, metadata]);

    const handleDescriptionChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setDescription(e.target.value);
        },
        [setDescription]
    );

    const handleUrlChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setSourceUrl(e.target.value);
        },
        [setSourceUrl]
    );

    useEffect(() => {
        setDescription(metadata?.description ?? '');
        setSourceUrl(metadata?.source_url ?? '');
    }, [metadata]);

    if (!model || !metadata) {
        return null;
    }

    return (
        <Box
            component="div"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                gap: 3,
                height: '1px',
            }}
        >
            <Typography variant="h6" component="h5">
                Metadata
            </Typography>
            <Divider />
            {!editMode && (
                <>
                    <Box
                        component="div"
                        sx={{
                            flexGrow: 1,
                            overflow: 'hidden',
                            backgroundColor: theme.palette.grey[900],
                            padding: '1rem',
                            borderRadius: `${theme.shape.borderRadius}px`,
                            border: `1px solid ${theme.palette.divider}`,
                        }}
                    >
                        <Box
                            component="div"
                            sx={{
                                height: '100%',
                                overflow: 'auto',
                                '& > :first-child': {
                                    marginTop: 0,
                                },
                                '& > :last-child': {
                                    marginBottom: 0,
                                },
                            }}
                        >
                            <Markdownify body={description} />
                        </Box>
                    </Box>
                    {sourceUrl && (
                        <Link
                            component={NextLink}
                            href={sourceUrl}
                            target="_blank"
                            rel="noopener"
                            sx={{ display: 'flex', gap: '0.5rem' }}
                        >
                            <LaunchIcon />
                            <span>Original source</span>
                        </Link>
                    )}
                </>
            )}
            {editMode && (
                <>
                    <TextField
                        fullWidth
                        multiline
                        key={`description-${id}`}
                        disabled={isPending}
                        value={description}
                        label="Description"
                        onChange={handleDescriptionChange}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSave();
                            }
                        }}
                        rows={5}
                        InputProps={{
                            sx: {
                                flexGrow: 1,
                                '& textarea': {
                                    height: '100% !important',
                                },
                            },
                        }}
                        sx={{ flexGrow: 1 }}
                    />
                    <TextField
                        fullWidth
                        key={`source_url-${id}`}
                        disabled={isPending}
                        value={sourceUrl}
                        label="Source URL"
                        onChange={handleUrlChange}
                        onKeyUp={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                handleSave();
                            }
                        }}
                    />
                </>
            )}
            <Box
                component="div"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <FormControlLabel
                    disabled={isPending}
                    label={
                        Boolean(metadata.commercial_use) ? (
                            <Typography variant="body1">
                                Commercial use
                            </Typography>
                        ) : (
                            <Typography
                                variant="body1muted"
                                sx={{ textDecoration: 'line-through' }}
                            >
                                Commercial use
                            </Typography>
                        )
                    }
                    control={
                        <Switch
                            checked={Boolean(metadata.commercial_use)}
                            onChange={(e) => {
                                mutate({
                                    id,
                                    metadata: {
                                        model_id: id,
                                        description: description,
                                        source_url: sourceUrl,
                                        commercial_use: e.target.checked,
                                        nsfw: metadata?.nsfw ?? false,
                                    },
                                });
                            }}
                        />
                    }
                />
                <FormControlLabel
                    disabled={isPending}
                    label={
                        Boolean(metadata.nsfw) ? (
                            <Typography variant="body1">NSFW</Typography>
                        ) : (
                            <Typography
                                variant="body1muted"
                                sx={{ textDecoration: 'line-through' }}
                            >
                                NSFW
                            </Typography>
                        )
                    }
                    control={
                        <Switch
                            checked={Boolean(metadata.nsfw)}
                            onChange={(e) => {
                                mutate({
                                    id,
                                    metadata: {
                                        model_id: id,
                                        description: description,
                                        source_url: sourceUrl,
                                        commercial_use:
                                            metadata?.commercial_use ?? false,
                                        nsfw: e.target.checked,
                                    },
                                });
                            }}
                        />
                    }
                />
            </Box>
            <Divider />
            <Box
                component="div"
                sx={{ display: 'flex', justifyContent: 'end', gap: 2 }}
            >
                {!editMode && (
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setEditMode(true)}
                    >
                        Edit
                    </Button>
                )}
                {editMode && (
                    <>
                        <Button
                            variant="outlined"
                            color="warning"
                            disabled={isPending}
                            onClick={() => {
                                setDescription(metadata.description ?? '');
                                setSourceUrl(metadata.source_url ?? '');
                                setEditMode(false);
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={isPending}
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </>
                )}
            </Box>
        </Box>
    );
};
