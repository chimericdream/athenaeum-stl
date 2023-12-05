import DownloadIcon from '@mui/icons-material/Download';
import {
    Box,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@mui/material';
import { filesize } from 'filesize';

import { FileDownloadButton } from '~/components/models/details/file-download-button';
import type { FileRecord } from '~/services/athenaeum';

export const FileList = ({
    files,
    title,
}: {
    files: Array<FileRecord>;
    title: string;
}) => {
    return (
        <>
            <Box
                sx={(theme) => ({
                    py: 1,
                    px: 2,
                    borderBottom: `1px solid ${theme.palette.grey[800]}`,
                })}
            >
                <Typography variant="h5">{title}</Typography>
            </Box>
            <List>
                {files.map((file) => (
                    <ListItem
                        key={file.id}
                        secondaryAction={<FileDownloadButton file={file} />}
                    >
                        <ListItemText
                            primary={file.name}
                            secondary={
                                file.file_size
                                    ? filesize(file.file_size, { round: 1 })
                                    : null
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </>
    );
};
