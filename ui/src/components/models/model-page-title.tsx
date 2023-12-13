'use client';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, type ChangeEvent } from 'react';

import { type Breadcrumb, Breadcrumbs } from '~/components/layout/breadcrumbs';
import {
    getModelUpdater,
    loadModel,
    type ModelRecord,
    type ModelUpdate,
} from '~/services/athenaeum';

export const ModelPageTitle = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(data?.name ?? '');

    const updateModel = getModelUpdater(id);

    const { isPending, mutate, reset } = useMutation<
        ModelRecord,
        Error,
        ModelUpdate
    >({
        mutationFn: updateModel,
        onSuccess: (model) => {
            queryClient.setQueryData(['models', id], model);
            setIsEditing(false);
        },
    });

    const cancel = useCallback(() => {
        setName(data?.name ?? '');
        setIsEditing(false);
    }, [data?.name, setIsEditing, setName]);

    const startEditing = useCallback(() => {
        reset();
        setIsEditing(true);
    }, [reset, setIsEditing]);

    const save = useCallback(() => {
        mutate({ name: name.trim() });
    }, [name, mutate]);

    const handleInput = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
        },
        [setName]
    );

    const crumbs: Breadcrumb[] = [
        {
            label: 'Models',
            href: '/models',
        },
        {
            label: data?.name ?? 'Unknown model',
            href: `/models/${id}`,
        },
    ];

    return (
        <>
            <Box component="div">
                {isEditing && (
                    <TextField
                        fullWidth
                        label="Model name"
                        id="edit-model-name"
                        value={name}
                        onChange={handleInput}
                        InputProps={{
                            sx: { pr: 0 },
                            endAdornment: (
                                <InputAdornment position="end">
                                    <ButtonGroup
                                        variant="contained"
                                        aria-label="outlined button group"
                                    >
                                        <Button
                                            color="warning"
                                            onClick={cancel}
                                            disabled={isPending}
                                            sx={{
                                                borderRadius: 0,
                                                paddingBlock:
                                                    'calc(1rem - 1px)',
                                            }}
                                        >
                                            <CloseIcon />
                                        </Button>
                                        <Button
                                            color="success"
                                            disabled={isPending}
                                            onClick={save}
                                            sx={{
                                                paddingBlock:
                                                    'calc(1rem - 1px)',
                                            }}
                                        >
                                            {isPending && <CircularProgress />}
                                            {!isPending && <SaveIcon />}
                                        </Button>
                                    </ButtonGroup>
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
                {!isEditing && (
                    <Box
                        component="div"
                        sx={{
                            alignItems: 'start',
                            display: 'flex',
                            flexGrow: 1,
                            gap: 2,
                        }}
                    >
                        <Typography variant="h4">
                            {data?.name ?? 'Unknown model'}
                        </Typography>
                        <IconButton onClick={startEditing}>
                            <EditIcon />
                        </IconButton>
                    </Box>
                )}
            </Box>
            <Breadcrumbs crumbs={crumbs} />
        </>
    );
};
