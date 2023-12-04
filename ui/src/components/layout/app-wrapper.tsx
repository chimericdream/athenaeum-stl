'use client';

import { type PropsWithChildren as PWC, useCallback, useState } from 'react';

import LeftNav from '~/components/layout/left-nav';
import MainContent from '~/components/layout/main-content';
import Navbar from '~/components/layout/navbar';

export default function AppWrapper({ children }: PWC) {
    const [leftNavOpen, setLeftNavOpen] = useState(false);

    const toggleLeftNav = useCallback(() => {
        setLeftNavOpen((prev) => !prev);
    }, [setLeftNavOpen]);

    return (
        <>
            <Navbar toggleLeftNav={toggleLeftNav} />
            <LeftNav open={leftNavOpen} toggleDrawer={toggleLeftNav} />
            <MainContent>{children}</MainContent>
        </>
    );
}
