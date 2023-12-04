'use client';

import { useQuery } from '@tanstack/react-query';

import { loadModel } from '~/services/athenaeum';

export const ModelDetails = ({ id }: { id: string }) => {
    const { data } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    return (
        <pre>
            <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
    );
};
