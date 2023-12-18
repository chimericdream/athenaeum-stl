'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { ModelList } from '~/components/models/model-list';
import { useModelListContext } from '~/contexts/model-list-context';
import { loadLabel } from '~/services/athenaeum';

export const LabelDetails = ({ id }: { id: string }) => {
    const { subset, setSubset } = useModelListContext();

    const { data: label } = useQuery({
        queryKey: ['labels', id],
        queryFn: () => loadLabel(id),
    });

    useEffect(() => {
        if (!label) {
            return;
        }

        if (!subset) {
            setSubset(label.models);
        }
    }, [label, subset, setSubset]);

    if (!label) {
        return null;
    }

    return <ModelList tableHeight="calc(100vh - 17.25rem)" />;
};
