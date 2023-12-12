import { Typography } from '@mui/material';
import { filesize } from 'filesize';

import { EditFileName } from '~/components/models/files/modals/edit-file-name';
import type { FileRecord } from '~/services/athenaeum';

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
        </>
    );
};
