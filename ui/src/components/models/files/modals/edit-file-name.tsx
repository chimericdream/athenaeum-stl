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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, type ChangeEvent } from 'react';

import {
    getFileRecordUpdater,
    type FileRecord,
    type FileUpdate,
} from '~/services/athenaeum';

export const EditFileName = ({ file }: { file: FileRecord }) => {
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(file.name);

    const updateFile = getFileRecordUpdater(file.id);

    const { isPending, mutate, reset } = useMutation<
        FileRecord,
        Error,
        FileUpdate
    >({
        mutationFn: updateFile,
        onSuccess: async (file) => {
            await queryClient.invalidateQueries({
                queryKey: ['models', file.model_id],
            });
            setIsEditing(false);
        },
    });

    const cancel = useCallback(() => {
        setName(file.name);
        setIsEditing(false);
    }, [file.name, setIsEditing, setName]);

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

    return (
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
                                            paddingBlock: 'calc(1rem - 1px)',
                                        }}
                                    >
                                        <CloseIcon />
                                    </Button>
                                    <Button
                                        color="success"
                                        disabled={isPending}
                                        onClick={save}
                                        sx={{
                                            paddingBlock: 'calc(1rem - 1px)',
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
                        flexGrow: 1,
                        gap: 2,
                    }}
                >
                    <Typography variant="body1" textOverflow="ellipsis">
                        {file.name}
                    </Typography>
                    <IconButton onClick={startEditing}>
                        <EditIcon />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};
