import Grid from '@mui/material/Unstable_Grid2';
import { Suspense } from 'react';

import { ModelTile } from '~/components/models/model-tile';
import type { Model } from '~/services/athenaeum';

// Next.js fetch API in action
async function loadPosts(): Promise<Array<Model>> {
    const res = await fetch('http://localhost:8000/models');
    return res.json();
}

const InnerList = async () => {
    const models = await loadPosts();

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
                    <ModelTile model={model} />
                </Grid>
            ))}
        </Grid>
    );
};

export const ModelList = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <InnerList />
        </Suspense>
    );
};
