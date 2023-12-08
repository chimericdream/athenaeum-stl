import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from '@tanstack/react-query';
import type { PropsWithChildren as PWC } from 'react';

import { AppWrapper } from '~/components/layout/app-wrapper';
import { Providers } from '~/components/layout/providers';
import { ThemeRegistry } from '~/components/theme-registry/theme-registry';
import { loadLabels } from '~/services/athenaeum';

export default async function RootLayout({ children }: PWC) {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ['labels'],
        queryFn: loadLabels,
    });

    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    <Providers>
                        <AppWrapper>
                            <HydrationBoundary state={dehydrate(queryClient)}>
                                {children}
                            </HydrationBoundary>
                        </AppWrapper>
                    </Providers>
                </ThemeRegistry>
            </body>
        </html>
    );
}
