'use client';

import DownloadIcon from '@mui/icons-material/Download';
import { IconButton } from '@mui/material';

import type { FileRecord } from '~/services/athenaeum';
import { getDownloadUrl } from '~/services/athenaeum';

export const FileDownloadButton = ({ file }: { file: FileRecord }) => {
    const url = getDownloadUrl(file);

    return (
        <IconButton
            edge="end"
            aria-label="Download"
            onClick={() => window.open(url)}
        >
            <DownloadIcon />
        </IconButton>
    );
};
