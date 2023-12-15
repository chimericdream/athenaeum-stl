'use client';

import { Button, ButtonGroup, Divider, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMachine } from '@xstate/react';
import { filesize } from 'filesize';
import { useEffect, useRef } from 'react';
import { createMachine } from 'xstate';

import { RefreshIcon } from '~/components/icons/refresh';
import { EditFileName } from '~/components/models/files/modals/edit-file-name';
import { type FileRecord, moveFileToModel } from '~/services/athenaeum';

const toggleMachine = createMachine({
    id: 'toggle',
    initial: 'idle',
    states: {
        idle: {
            on: { START_MOVE: 'prompting' },
        },
        prompting: {
            on: { CANCEL: 'idle', CONFIRM: 'moving' },
        },
        moving: {
            on: { SUCCESS: 'idle' },
        },
    },
});

export const FileDetails = ({ file }: { file: FileRecord }) => {
    const [state, send] = useMachine(toggleMachine);

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
    }, [file.id, mutate, state.value]);

    return (
        <>
            <EditFileName file={file} />
            <Typography variant="body2">
                {file.file_size
                    ? filesize(file.file_size, {
                          round: 1,
                      })
                    : null}
            </Typography>
            <Divider sx={{ my: 1 }} />
            {state.value === 'idle' && (
                <Button
                    variant="contained"
                    onClick={() => send({ type: 'START_MOVE' })}
                >
                    Move to new model
                </Button>
            )}
            {state.value === 'prompting' && (
                <ButtonGroup variant="contained">
                    <Button onClick={() => send({ type: 'CONFIRM' })}>
                        Confirm
                    </Button>
                    <Button
                        color="warning"
                        onClick={() => send({ type: 'CANCEL' })}
                    >
                        Cancel
                    </Button>
                </ButtonGroup>
            )}
            {state.value === 'moving' && (
                <Button variant="contained">
                    <RefreshIcon isRotating />
                    <Typography>Moving</Typography>
                </Button>
            )}
        </>
    );
};
