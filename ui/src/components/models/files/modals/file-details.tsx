import { Button, Divider, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filesize } from 'filesize';
import { useRef } from 'react';

import { EditFileName } from '~/components/models/files/modals/edit-file-name';
import { type FileRecord, moveFileToModel } from '~/services/athenaeum';

export const FileDetails = ({ file }: { file: FileRecord }) => {
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
            <Button
                variant="contained"
                onClick={() => mutate({ id: file.id, modelId: 'new' })}
            >
                Move to new model
            </Button>
        </>
    );
};
