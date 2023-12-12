import { Typography } from '@mui/material';
import { filesize } from 'filesize';

import type { FileRecord } from '~/services/athenaeum';

export const FileDetails = ({ file }: { file: FileRecord }) => {
    return (
        <>
            <Typography variant="body1" textOverflow="ellipsis">
                {file.name}
            </Typography>
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
