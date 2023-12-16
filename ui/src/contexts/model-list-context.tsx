'use client';

import type {
    GridCallbackDetails,
    GridPaginationModel,
} from '@mui/x-data-grid';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    type MouseEvent,
    type PropsWithChildren as PWC,
    createContext,
    useCallback,
    useContext,
} from 'react';

import { useModelListSettings } from '~/hooks/use-model-list-settings';

interface ModelListContextType {
    mode: 'grid' | 'list';
    order: 'asc' | 'desc';
    sort: 'name' | 'date';
    page: number;
    pageSize: 25 | 50 | 100;
    updatePagination: (
        model: GridPaginationModel,
        details: GridCallbackDetails
    ) => void;
    handleModeChange: (
        _: MouseEvent<HTMLElement>,
        newMode: 'grid' | 'list'
    ) => void;
    handleSortOrderChange: (
        _: MouseEvent<HTMLElement>,
        value: 'name|asc' | 'name|desc' | 'date|asc' | 'date|desc'
    ) => void;
}

export const ModelListContext = createContext<ModelListContextType>({
    mode: 'list',
    order: 'asc',
    sort: 'name',
    page: 0,
    pageSize: 25,
    updatePagination: () => {},
    handleModeChange: () => {},
    handleSortOrderChange: () => {},
});

export const ModelListProvider = ({ children }: PWC) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { mode, order, sort, page, pageSize } = useModelListSettings();

    const makeQueryString = useCallback(
        (updates: { [key: string]: string }) => {
            const params = new URLSearchParams(searchParams);
            Object.entries(updates).forEach(([name, value]) => {
                params.set(name, value);
            });

            return params.toString();
        },
        [searchParams]
    );

    const updatePagination = useCallback(
        ({ page, pageSize }: GridPaginationModel) => {
            router.push(
                `${pathname}?${makeQueryString({
                    page: page.toString(),
                    pageSize: pageSize.toString(),
                })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    const handleModeChange = useCallback(
        (_: MouseEvent<HTMLElement>, newMode: 'grid' | 'list') => {
            router.push(`${pathname}?${makeQueryString({ mode: newMode })}`);
        },
        [makeQueryString, pathname, router]
    );

    const handleSortOrderChange = useCallback(
        (
            _: MouseEvent<HTMLElement>,
            value: 'name|asc' | 'name|desc' | 'date|asc' | 'date|desc'
        ) => {
            const [newSort, newOrder] = value.split('|');

            router.push(
                `${pathname}?${makeQueryString({
                    order: newOrder,
                    sort: newSort,
                })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    const ctx: ModelListContextType = {
        mode,
        order,
        sort,
        page,
        pageSize,
        updatePagination,
        handleModeChange,
        handleSortOrderChange,
    } as ModelListContextType;

    return (
        <ModelListContext.Provider value={ctx}>
            {children}
        </ModelListContext.Provider>
    );
};

export const useModelListContext = () => {
    const context = useContext(ModelListContext);

    if (!context) {
        throw new Error(
            'useModelListContext must be used within a ModelListProvider'
        );
    }

    return context;
};
