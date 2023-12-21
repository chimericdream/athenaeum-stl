import { type PropsWithChildren as PWC } from 'react';

import { MainContent } from '~/components/layout/main-content';
import { Navigation } from '~/components/navigation';
import { AppSidebarProvider } from '~/contexts/app-sidebar-context';

export const AppWrapper = ({ children }: PWC) => {
    return (
        <AppSidebarProvider>
            <Navigation />
            <MainContent>{children}</MainContent>
        </AppSidebarProvider>
    );
};
