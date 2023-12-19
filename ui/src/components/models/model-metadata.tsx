'use client';

import LaunchIcon from '@mui/icons-material/Launch';
import {
    Box,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type ChangeEvent, useCallback, useState } from 'react';

import {
    type ModelMetadata,
    type ModelRecord,
    loadModel,
    updateModelMetadata,
} from '~/services/athenaeum';

export const ModelMeta = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();

    const { data: model } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    const metadata = model?.metadata;

    const [description, setDescription] = useState(metadata?.description ?? '');
    const [sourceUrl, setSourceUrl] = useState(metadata?.source_url ?? '');

    const { isPending, mutate } = useMutation<
        ModelRecord,
        Error,
        { id: string; metadata: ModelMetadata }
    >({
        mutationFn: updateModelMetadata,
        onSuccess: (model) => {
            queryClient.setQueryData(['models', id], model);
        },
    });

    const handleBlur = useCallback(() => {
        mutate({
            id,
            metadata: {
                model_id: id,
                description: description,
                source_url: sourceUrl,
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

    if (!model || !metadata) {
        return null;
    }

    return (
        <>
            <Typography variant="h6" component="h5" sx={{ mb: 3 }}>
                Metadata
            </Typography>
            <Divider sx={{ my: 3 }} />
            <TextField
                fullWidth
                multiline
                disabled={isPending}
                value={description}
                label="Description"
                onChange={handleDescriptionChange}
                onBlur={handleBlur}
                rows={6}
                sx={{ mb: 3 }}
            />
            <TextField
                fullWidth
                disabled={isPending}
                value={sourceUrl}
                label="Source URL"
                onChange={handleUrlChange}
                onBlur={handleBlur}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                href={sourceUrl}
                                target="_blank"
                                rel="noopener"
                                disabled={!sourceUrl}
                            >
                                <LaunchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <Divider sx={{ my: 3 }} />
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
        </>
    );
};
