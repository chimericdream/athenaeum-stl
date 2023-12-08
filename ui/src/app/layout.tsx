import type { PropsWithChildren as PWC } from 'react';

import { AppWrapper } from '~/components/layout/app-wrapper';
import { Providers } from '~/components/layout/providers';
import { ThemeRegistry } from '~/components/theme-registry/theme-registry';

export default function RootLayout({ children }: PWC) {
    return (
        <html lang="en">
            <body>
                <ThemeRegistry>
                    <Providers>
                        <AppWrapper>{children}</AppWrapper>
                    </Providers>
                </ThemeRegistry>
            </body>
        </html>
    );
}
