'use client';

import { Box, Link } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import NextLink from 'next/link';

import { ListFilterInput } from '~/components/models/model-list/list-filter-input';
import { ModelListToggleButtons } from '~/components/models/model-list/list-toggle-buttons';
import { ModelTile } from '~/components/models/model-tile';
import { useModelListContext } from '~/contexts/model-list-context';
import type { Model } from '~/services/athenaeum';

export const ModelGrid = ({ models }: { models: Model[] }) => {
    const { filter } = useModelListContext();
    const theme = useTheme();

    let filteredModels = [...models];
    if (filter) {
        filteredModels = models.filter((model) =>
            model.name.toLowerCase().includes(filter.toLowerCase())
        );
    }

    return (
        <>
            <Box
                component="div"
                sx={{
                    backgroundColor: theme.palette.background.default,
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBlock: '1rem',
                    position: 'sticky',
                    top: '4rem',
                    zIndex: 1,
                }}
            >
                <ListFilterInput />
                <ModelListToggleButtons />
            </Box>
            <Grid container spacing={2} sx={{ paddingBlock: '0.5rem' }}>
                {filteredModels.map((model) => (
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
