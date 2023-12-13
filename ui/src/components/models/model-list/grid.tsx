'use client';

import { Box, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import NextLink from 'next/link';
import type { ReactElement } from 'react';

import { ModelTile } from '~/components/models/model-tile';
import type { Model } from '~/services/athenaeum';

export const ModelGrid = ({
    models,
    toggleButtons,
}: {
    models: Model[];
    toggleButtons: ReactElement;
}) => {
    const theme = useTheme();

    return (
        <>
            <Box
                component="div"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    display: 'flex',
                    justifyContent: 'end',
                    paddingBlock: '1rem',
                    position: 'sticky',
                    top: '4rem',
                    zIndex: 1,
                }}
            >
                {toggleButtons}
            </Box>
            <Grid container spacing={2} sx={{ paddingBlock: '0.5rem' }}>
                {models.map((model) => (
                    <Grid
                        key={model.id}
                        xs={12}
                        sm={4}
                        lg={3}
                        sx={{ height: '100%', overflow: 'hidden' }}
                    >
                        <Link href={`/models/${model.id}`} component={NextLink}>
                            <ModelTile model={model} />
                        </Link>
                    </Grid>
                ))}
            </Grid>
        </>
    );
};
