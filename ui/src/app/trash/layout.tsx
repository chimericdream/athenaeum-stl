import {
    HydrationBoundary,
    QueryClient,
    dehydrate,
} from '@tanstack/react-query';
import type { PropsWithChildren as PWC } from 'react';

import { ModelListProvider } from '~/contexts/model-list-context';
import { loadModels } from '~/services/athenaeum';

export default async function SharedModelLayout({ children }: PWC) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['models'],
        queryFn: loadModels,
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ModelListProvider>{children}</ModelListProvider>
        </HydrationBoundary>
    );
}
