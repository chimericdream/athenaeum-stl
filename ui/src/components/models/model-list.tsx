'use client';

import Grid from '@mui/material/Unstable_Grid2';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

import { ModelTile } from '~/components/models/model-tile';
import { loadModels } from '~/services/athenaeum';

export const ModelList = () => {
    const { data } = useQuery({ queryKey: ['models'], queryFn: loadModels });
    const models = data ?? [];

    return (
        <Grid container gap={3}>
            {models.map((model) => (
                <Grid
                    key={model.id}
                    xs={12}
                    sm={4}
                    lg={3}
                    sx={{ overflow: 'hidden' }}
                >
                    <Link href={`/models/${model.id}`}>
                        <ModelTile model={model} />
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
};
