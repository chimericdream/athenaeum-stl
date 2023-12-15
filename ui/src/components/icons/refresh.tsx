'use client';

import CachedIcon from '@mui/icons-material/Cached';
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles(() =>
    createStyles({
        regularIcon: {
            transform: 'scaleX(-1)',
        },
        rotateIcon: {
            animation: '$spin 2s linear infinite',
        },
        '@keyframes spin': {
            '0%': {
                transform: 'scaleX(-1) rotate(0deg)',
            },
            '100%': {
                transform: 'scaleX(-1) rotate(-360deg)',
            },
        },
    })
);

export const RefreshIcon = ({ isRotating }: { isRotating: boolean }) => {
    const styles = useStyles();

    return (
        <CachedIcon
            className={isRotating ? styles.rotateIcon : styles.regularIcon}
        />
    );
};
