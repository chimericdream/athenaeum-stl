'use client';

import { Typography } from '@mui/material';
import { format } from 'date-fns';

import { rsToJsDateString } from '~/util/dates';

export const ImportedAt = ({ dateTime }: { dateTime: string }) => {
    const date = new Date(rsToJsDateString(dateTime));

    return (
        <Typography variant="body3">
            {format(date, "'Imported' MM/dd/yyyy 'at' p")}
        </Typography>
    );
};
