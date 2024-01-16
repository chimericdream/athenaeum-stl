'use client';

import { useQuery } from '@tanstack/react-query';

import { ModelList } from '~/components/models/model-list';
import { loadLabel } from '~/services/athenaeum';

export const LabelDetails = ({ id }: { id: string }) => {
    const { data: label } = useQuery({
        queryKey: ['labels', id],
        queryFn: () => loadLabel(id),
    });

    if (!label) {
        return null;
    }

    return (
        <ModelList
            tableHeight="calc(100vh - 17.25rem)"
            overrides={{ subset: label.models }}
        />
    );
};
