'use client';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    ToggleButton,
    Typography,
} from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    type ChangeEvent,
    type KeyboardEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { RefreshIcon } from '~/components/icons/refresh';
import { type Breadcrumb, Breadcrumbs } from '~/components/layout/breadcrumbs';
import {
    type ModelRecord,
    type ModelUpdate,
    getModelUpdater,
    loadModel,
    openModelLocation,
} from '~/services/athenaeum';

export const ModelPageTitle = ({ id }: { id: string }) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(data?.name ?? '');

    const [isReloading, setIsReloading] = useState(false);

    const reloadModel = useCallback(async () => {
        setIsReloading(true);
        await queryClient.invalidateQueries({ queryKey: ['models', id] });
        setTimeout(() => setIsReloading(false), 1000);
    }, [id, queryClient, setIsReloading]);

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

    const handleKeyUp = useCallback(
        (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                cancel();
            } else if (event.key === 'Enter') {
                save();
            }
        },
        [cancel, save]
    );

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

    useEffect(() => {
        if (isEditing) {
            setTimeout(() => inputRef.current?.focus(), 250);
        }
    }, [isEditing]);

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
                        onKeyUp={handleKeyUp}
                        inputRef={inputRef}
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
                            alignItems: 'center',
                            display: 'flex',
                            justifyContent: 'space-between',
                            flexGrow: 1,
                            gap: 2,
                        }}
                    >
                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                alignItems: 'start',
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
                        <Box
                            component="div"
                            sx={{
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <ToggleButton
                                value="open"
                                onClick={() => openModelLocation(id)}
                            >
                                <FolderIcon />
                            </ToggleButton>
                            <ToggleButton
                                value="reload"
                                selected={isReloading}
                                onClick={reloadModel}
                            >
                                <RefreshIcon isRotating={isReloading} />
                            </ToggleButton>
                        </Box>
                    </Box>
                )}
            </Box>
            <Breadcrumbs crumbs={crumbs} />
        </>
    );
};
