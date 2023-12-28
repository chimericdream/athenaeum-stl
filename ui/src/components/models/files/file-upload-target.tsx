'use client';

import { Card, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import queue from 'throttled-queue';

import { type ModelRecord, uploadFileToModel } from '~/services/athenaeum';

// Limit file uploads to 1 at a time, with a 1s delay between each
const throttle = queue(1, 1000);

export const FileUploadTarget = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();
    const theme = useTheme();

    const { isPending, mutate } = useMutation<
        ModelRecord,
        Error,
        { id: string; file: File }
    >({
        mutationFn: uploadFileToModel,
        onSuccess: (model) => {
            queryClient.setQueryData(['models', id], model);
        },
    });

    const onDrop = useCallback(
        (files: File[]) => {
            for (const file of files) {
                throttle(() => mutate({ id, file }));
            }
        },
        [id, mutate]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        disabled: isPending,
        onDrop,
    });

    return (
        <Card
            variant="outlined"
            {...getRootProps()}
            sx={{
                backgroundColor: isDragActive
                    ? theme.palette.success.dark
                    : theme.palette.grey[900],
                cursor: 'pointer',
                paddingInline: 2,
                textAlign: 'center',
                height: '8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexGrow: 1,
            }}
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <Typography variant="body1">Upload files...</Typography>
            ) : (
                <Typography variant="body1">
                    Drop files here to upload them to the model
                </Typography>
            )}
        </Card>
    );
};
