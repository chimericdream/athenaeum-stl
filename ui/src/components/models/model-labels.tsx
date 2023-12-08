'use client';

import { Chip, Divider, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';

import { AddLabelInput } from '~/components/labels/add-label-input';
import { loadLabels, loadModel } from '~/services/athenaeum';

export const ModelLabels = ({ id }: { id: string }) => {
    const { data: model } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    const { data: allLabels } = useQuery({
        queryKey: ['labels'],
        queryFn: () => loadLabels(),
    });

    if (!model || !model.labels || !allLabels) {
        return null;
    }

    const { labels } = model;

    return (
        <>
            <Typography variant="h6" component="h5" sx={{ mb: 3 }}>
                Labels
            </Typography>
            <AddLabelInput modelId={id} />
            <Divider sx={{ my: 3 }} />
            {labels.length === 0 && (
                <Typography align="center" variant="body1">
                    This model has not been labeled yet. Add a label above to
                    get started.
                </Typography>
            )}
            {labels.map((label) => (
                <Chip
                    key={label.label_id}
                    label="foo"
                    sx={{ margin: 0.5 }}
                    variant="outlined"
                />
            ))}
        </>
    );
};
