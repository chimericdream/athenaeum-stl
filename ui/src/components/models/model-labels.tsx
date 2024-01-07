'use client';

import { Chip, Divider, Typography } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
    LabelEntry,
    type ModelRecord,
    deleteLabelFromModel,
    loadLabels,
    loadModel,
} from '~/services/athenaeum';

import { AddModelLabelInput } from './add-model-label-input';

export const ModelLabels = ({ id }: { id: string }) => {
    const queryClient = useQueryClient();

    const { data: model } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    const { data: allLabels } = useQuery({
        queryKey: ['labels'],
        queryFn: loadLabels,
    });

    const { mutate } = useMutation<
        ModelRecord,
        Error,
        { id: string; label: LabelEntry }
    >({
        mutationFn: deleteLabelFromModel,
        onSuccess: async (model) => {
            queryClient.setQueryData(['models', id], model);
        },
    });

    const labels = useMemo(() => {
        if (!model?.labels || !allLabels) {
            return null;
        }

        const list: LabelEntry[] = [];

        for (const label of model.labels) {
            const l = allLabels.find((l) => l.id === label.label_id);
            if (l) {
                list.push(l);
            }
        }

        return list.toSorted((a, b) => a.name.localeCompare(b.name));
    }, [model, allLabels]);

    if (!labels) {
        return null;
    }

    return (
        <>
            <Typography variant="h6" component="h5" sx={{ mb: 3 }}>
                Labels
            </Typography>
            <AddModelLabelInput modelId={id} />
            <Divider sx={{ my: 3 }} />
            {labels.length === 0 && (
                <Typography align="center" variant="body1">
                    This model has not been labeled yet. Add a label above to
                    get started.
                </Typography>
            )}
            {labels.map((label) => (
                <Chip
                    key={label.id}
                    label={label.name}
                    sx={{ margin: 0.5 }}
                    variant="outlined"
                    onDelete={() => mutate({ id, label })}
                />
            ))}
        </>
    );
};
