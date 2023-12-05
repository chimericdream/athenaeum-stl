import { type PropsWithChildren as PWC } from 'react';

import { MainContent } from '~/components/layout/main-content';
import { Navigation } from '~/components/navigation';

export const AppWrapper = ({ children }: PWC) => {
    return (
        <>
            <Navigation />
            <MainContent>{children}</MainContent>
        </>
    );
};
