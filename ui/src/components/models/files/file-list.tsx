'use client';

import { Box, Chip, List, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { FileListItem } from '~/components/models/files/file-list-item';
import type { FileRecord } from '~/services/athenaeum';

interface Props {
    files: Array<FileRecord>;
    title: string;
}

export const FileList = ({ files, title }: Props) => {
    const theme = useTheme();

    return (
        <>
            <Box
                component="div"
                sx={(theme) => ({
                    py: 1,
                    px: 2,
                    borderBottom: `1px solid ${theme.palette.grey[800]}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                })}
            >
                <Typography variant="h5">{title}</Typography>
                <Chip
                    label={files.length}
                    sx={{ backgroundColor: theme.palette.primary.light }}
                    size="small"
                    title="Number of files"
                />
            </Box>
            <List sx={{ maxHeight: '20rem', overflow: 'auto', py: 0 }}>
                {files.map((file) => (
                    <FileListItem key={file.id} file={file} />
                ))}
            </List>
        </>
    );
};
