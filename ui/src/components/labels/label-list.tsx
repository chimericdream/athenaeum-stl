'use client';

import { useQuery } from '@tanstack/react-query';

import { loadLabels } from '~/services/athenaeum';

export const LabelList = () => {
    const { data } = useQuery({ queryKey: ['labels'], queryFn: loadLabels });
    const labels = data ?? [];

    return <div>Labels</div>;
};
