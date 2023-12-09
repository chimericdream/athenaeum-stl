'use client';

import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';

import { type FileRecord, getStaticUrl } from '~/services/athenaeum';

export const TextPreview = ({ file }: { file: FileRecord }) => {
    const [text, setText] = useState('');
    const [error, setError] = useState(false);

    const theme = useTheme();

    useEffect(() => {
        const loadText = async () => {
            const response = await fetch(getStaticUrl(file));
            const txt = await response.text();

            setText(txt);
        };

        try {
            void loadText();
        } catch {
            setError(true);
        }
        /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, []);

    if (error) {
        return <div>Failed to load file</div>;
    }

    return (
        <Box
            component="div"
            sx={{
                height: '100%',
                backgroundColor: theme.palette.backgroundAlt.paper,
                overflow: 'auto',
                padding: theme.spacing(1),
            }}
        >
            <Typography sx={{ fontFamily: 'Monospace' }}>{text}</Typography>
        </Box>
    );
};
