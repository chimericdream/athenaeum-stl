import { Box, List, Typography } from '@mui/material';

import { FileListItem } from '~/components/models/files/file-list-item';
import type { FileRecord } from '~/services/athenaeum';

interface Props {
    files: Array<FileRecord>;
    title: string;
}

export const FileList = ({ files, title }: Props) => {
    return (
        <>
            <Box
                component="div"
                sx={(theme) => ({
                    py: 1,
                    px: 2,
                    borderBottom: `1px solid ${theme.palette.grey[800]}`,
                })}
            >
                <Typography variant="h5">{title}</Typography>
            </Box>
            <List sx={{ maxHeight: '20rem', overflow: 'auto', py: 0 }}>
                {files.map((file) => (
                    <FileListItem key={file.id} file={file} />
                ))}
            </List>
        </>
    );
};
