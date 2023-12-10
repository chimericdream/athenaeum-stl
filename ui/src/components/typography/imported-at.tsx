'use client';

import { Typography } from '@mui/material';
import { format } from 'date-fns';

import { rsToJsDateString } from '~/util/dates';

interface Props {
    dateTime: string;
    dateOnly?: boolean;
    variant?: 'body1' | 'body2' | 'body3';
}

export const ImportedAt = (props: Props) => {
    const { dateTime, dateOnly = true, variant = 'body3' } = props;
    const date = new Date(rsToJsDateString(dateTime));

    if (dateOnly) {
        return (
            <Typography variant={variant}>
                {format(date, 'MM/dd/yyyy, p')}
            </Typography>
        );
    }

    return (
        <Typography variant={variant}>
            {format(date, "'Imported' MM/dd/yyyy 'at' p")}
        </Typography>
    );
};
