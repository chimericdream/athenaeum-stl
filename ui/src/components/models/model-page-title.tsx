'use client';

import { useQuery } from '@tanstack/react-query';

import { type Breadcrumb, Breadcrumbs } from '~/components/layout/breadcrumbs';
import { PageTitle } from '~/components/typography/page-title';
import { loadModel } from '~/services/athenaeum';

export const ModelPageTitle = ({ id }: { id: string }) => {
    const { data } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    const crumbs: Breadcrumb[] = [
        {
            label: 'Models',
            href: '/models',
        },
        {
            label: data?.name ?? 'Unknown model',
            href: `/models/${id}`,
        },
    ];

    return (
        <>
            <PageTitle title={data?.name ?? 'Unknown model'} />
            <Breadcrumbs crumbs={crumbs} />
        </>
    );
};
