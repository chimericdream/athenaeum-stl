'use client';

import { Box, Link } from '@mui/material';
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
}) => (
    <>
        <Box
            component="div"
            p={1}
            sx={{ display: 'flex', justifyContent: 'end' }}
        >
            {toggleButtons}
        </Box>
        <Grid container>
            {models.map((model) => (
                <Grid
                    key={model.id}
                    xs={12}
                    sm={4}
                    lg={3}
                    sx={{ overflow: 'hidden', padding: 1 }}
                >
                    <Link href={`/models/${model.id}`} component={NextLink}>
                        <ModelTile model={model} />
                    </Link>
                </Grid>
            ))}
        </Grid>
    </>
);
