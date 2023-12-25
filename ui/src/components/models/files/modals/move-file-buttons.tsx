import {
    Autocomplete,
    Button,
    ButtonGroup,
    TextField,
    Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMachine } from '@xstate/react';
import { useEffect, useRef } from 'react';

import { RefreshIcon } from '~/components/icons/refresh';
import { useModelList } from '~/hooks/models/use-model-list';
import { moveFileMachine } from '~/machines/move-file-machine';
import { type FileRecord, moveFileToModel } from '~/services/athenaeum';

export const MoveFileButtons = ({ file }: { file: FileRecord }) => {
    const { models } = useModelList({
        order: 'asc',
        sort: 'name',
        includeNsfw: null,
        fileFilters: {
            parts: 'any',
            projects: 'any',
            images: 'any',
            supportFiles: 'any',
        },
        labelState: 'all',
        subset: null,
        withLink: 'any',
        isDeleted: false,
    });

    const [state, send] = useMachine(moveFileMachine);

    const queryClient = useQueryClient();
    const originalModelId = useRef(file.model_id);

    const { mutate } = useMutation<
        FileRecord,
        Error,
        { id: string; modelId: string }
    >({
        mutationFn: moveFileToModel,
        onSuccess: async (updatedFile) => {
            await queryClient.invalidateQueries({
                queryKey: ['models', originalModelId.current],
            });
            await queryClient.invalidateQueries({
                queryKey: ['models', updatedFile.model_id],
            });
        },
    });

    useEffect(() => {
        if (state.value === 'moving') {
            mutate({ id: file.id, modelId: 'new' });
        }
        if (state.value === 'migrating' && state.context.destinationModel) {
            mutate({ id: file.id, modelId: state.context.destinationModel.id });
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps -- I explicitly don't want this to fire when the context changes */
    }, [file.id, mutate, state.value]);

    const confirmAndCancelButtons = (
        <ButtonGroup variant="contained" sx={{ display: 'flex' }}>
            <Button
                color="warning"
                onClick={() => send({ type: 'CANCEL' })}
                sx={{ flexGrow: 1 }}
            >
                Cancel
            </Button>
            <Button
                onClick={() => send({ type: 'CONFIRM' })}
                sx={{ flexGrow: 1 }}
            >
                Confirm
            </Button>
        </ButtonGroup>
    );

    switch (state.value) {
        case 'migrate':
            return (
                <>
                    <Autocomplete
                        id="free-solo-demo"
                        freeSolo
                        options={models}
                        onChange={(event, value) => {
                            if (value === null || typeof value !== 'string') {
                                send({ type: 'SET_DESTINATION', model: value });
                            }
                        }}
                        getOptionLabel={(option) => {
                            if (typeof option === 'string') {
                                return option;
                            }
                            return option.name;
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Choose a model" />
                        )}
                        sx={{ marginBottom: '0.5rem' }}
                    />
                    {confirmAndCancelButtons}
                </>
            );
        case 'createAndMove':
            return confirmAndCancelButtons;
        case 'migrating':
        case 'moving':
            return (
                <ButtonGroup variant="contained" sx={{ display: 'flex' }}>
                    <Button
                        disabled
                        variant="contained"
                        sx={{ display: 'flex', gap: '0.5rem', flexGrow: 1 }}
                    >
                        <RefreshIcon isRotating />
                        <Typography>Moving...</Typography>
                    </Button>
                </ButtonGroup>
            );
        case 'idle':
        default:
            return (
                <ButtonGroup variant="contained" sx={{ display: 'flex' }}>
                    <Button
                        onClick={() => send({ type: 'CREATE_AND_MOVE' })}
                        sx={{ flexGrow: 1 }}
                    >
                        Move to new model
                    </Button>
                    <Button
                        onClick={() => send({ type: 'MIGRATE' })}
                        sx={{ flexGrow: 1 }}
                    >
                        Move to existing model
                    </Button>
                </ButtonGroup>
            );
    }
};
