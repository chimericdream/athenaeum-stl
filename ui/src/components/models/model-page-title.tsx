'use client';

import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Link } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import NextLink from 'next/link';

import { PageTitle } from '~/components/typography/page-title';
import { loadModel } from '~/services/athenaeum';

export const ModelPageTitle = ({ id }: { id: string }) => {
    const { data } = useQuery({
        queryKey: ['models', id],
        queryFn: () => loadModel(id),
    });

    return (
        <PageTitle
            title={data?.name ?? 'Unknown model'}
            subtitle={
                <>
                    <Link href="/models" component={NextLink} color="primary">
                        Models
                    </Link>
                    <ChevronRightIcon />
                    <span>{data?.name ?? 'Unknown model'}</span>
                </>
            }
        />
    );
};
