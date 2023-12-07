'use client';

import { Box, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useQuery } from '@tanstack/react-query';

import { FileList } from '~/components/models/files/file-list';
import { ImportedAt } from '~/components/typography/imported-at';
import { loadModel } from '~/services/athenaeum';

export const ModelDetails = ({ id }: { id: string }) => {
    const { data: model } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    if (!model) {
        return null;
    }

    return (
        <>
            <Box component="div">
                <ImportedAt dateTime={model.imported_at} />
            </Box>
            <Grid container gap={3}>
                <Grid xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent sx={{ padding: '0 !important' }}>
                            <FileList files={model.parts} title="Parts" />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent sx={{ padding: '0 !important' }}>
                            <FileList files={model.images} title="Images" />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent sx={{ padding: '0 !important' }}>
                            <FileList files={model.projects} title="Projecs" />
                        </CardContent>
                    </Card>
                </Grid>
                <Grid xs={12} sm={6} md={4}>
                    <Card variant="outlined">
                        <CardContent sx={{ padding: '0 !important' }}>
                            <FileList
                                files={model.support_files}
                                title="Support files"
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            {/*<pre>*/}
            {/*    <code>{JSON.stringify(model, null, 2)}</code>*/}
            {/*</pre>*/}
        </>
    );
};
