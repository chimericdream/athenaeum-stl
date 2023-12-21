'use client';

import {
    type MutableRefObject,
    type PropsWithChildren as PWC,
    createContext,
    useContext,
    useRef,
    useState,
} from 'react';

export interface AppSidebarContextType {
    drawerOpen: boolean;
    setDrawerOpen: (open: boolean) => void;
    sidebarContentRef: MutableRefObject<HTMLDivElement | null>;
}

export const AppSidebarContext = createContext<AppSidebarContextType | null>(
    null
);

export const AppSidebarProvider = ({ children }: PWC) => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const sidebarContentRef = useRef<HTMLDivElement | null>(null);

    const ctx: AppSidebarContextType = {
        drawerOpen,
        setDrawerOpen,
        sidebarContentRef,
    };

    return (
        <AppSidebarContext.Provider value={ctx}>
            {children}
        </AppSidebarContext.Provider>
    );
};

export const useAppSidebar = () => {
    const ctx = useContext(AppSidebarContext);

    if (!ctx) {
        throw new Error(
            'useAppSidebar must be used within an AppSidebarProvider'
        );
    }

    return ctx;
};
