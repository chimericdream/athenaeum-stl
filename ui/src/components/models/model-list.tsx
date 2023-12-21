'use client';

import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useAppSidebar } from '~/contexts/app-sidebar-context';
import { useModelList } from '~/hooks/models/use-model-list';

import { ModelGrid } from './model-list/grid';
import { ListSidebarToggles } from './model-list/list-sidebar-toggles';
import { ModelTable } from './model-list/table';

export const ModelList = (props: { tableHeight?: string }) => {
    const [isMounted, setIsMounted] = useState(false);
    const { models, settings } = useModelList();
    const { sidebarContentRef } = useAppSidebar();

    const { mode } = settings;

    const tableHeight = props.tableHeight || 'calc(100vh - 13.75rem)';

    // This is a hack to force the sidebar to re-render when the page is loaded
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <Box component="div">
            {mode === 'grid' && <ModelGrid models={models} />}
            {mode === 'list' && (
                <ModelTable models={models} tableHeight={tableHeight} />
            )}
            {sidebarContentRef.current &&
                createPortal(
                    <ListSidebarToggles />,
                    sidebarContentRef.current as HTMLDivElement
                )}
        </Box>
    );
};
