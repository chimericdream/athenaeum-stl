import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import type { PropsWithChildren as PWC } from 'react';

import { LabelListProvider } from '~/contexts/label-list-context';
import { loadLabels } from '~/services/athenaeum';

export default async function SharedLabelLayout({ children }: PWC) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['labels'],
        queryFn: loadLabels,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <LabelListProvider>{children}</LabelListProvider>
        </HydrationBoundary>
    );
}
