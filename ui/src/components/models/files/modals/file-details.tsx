'use client';

import { Divider, Typography } from '@mui/material';
import { filesize } from 'filesize';

import { EditFileName } from '~/components/models/files/modals/edit-file-name';
import { MoveFileButtons } from '~/components/models/files/modals/move-file-buttons';
import { type FileRecord } from '~/services/athenaeum';

export const FileDetails = ({ file }: { file: FileRecord }) => {
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
            <MoveFileButtons file={file} />
        </>
    );
};
