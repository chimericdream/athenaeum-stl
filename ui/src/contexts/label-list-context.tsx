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
    useState,
} from 'react';

import { useLabelListSettings } from '~/hooks/labels/use-label-list-settings';

interface LabelListContextType {
    filter: string | null;
    order: 'asc' | 'desc';
    sort: 'name' | 'model_count';
    page: number;
    pageSize: 25 | 50 | 100;
    setFilter: (filter: string | null) => void;
    updatePagination: (
        model: GridPaginationModel,
        details: GridCallbackDetails
    ) => void;
    handleSortOrderChange: (
        _: MouseEvent<HTMLElement>,
        value: 'name|asc' | 'name|desc' | 'date|asc' | 'date|desc'
    ) => void;
}

export const LabelListContext = createContext<LabelListContextType>({
    filter: null,
    order: 'asc',
    sort: 'name',
    page: 0,
    pageSize: 25,
    setFilter: () => {},
    updatePagination: () => {},
    handleSortOrderChange: () => {},
});

export const LabelListProvider = ({ children }: PWC) => {
    const [filter, setFilter] = useState<string | null>(null);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const { order, sort, page, pageSize } = useLabelListSettings();

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

    const ctx: LabelListContextType = {
        filter,
        order,
        sort,
        page,
        pageSize,
        setFilter,
        updatePagination,
        handleSortOrderChange,
    } as LabelListContextType;

    return (
        <LabelListContext.Provider value={ctx}>
            {children}
        </LabelListContext.Provider>
    );
};

export const useLabelListContext = () => {
    const context = useContext(LabelListContext);

    if (!context) {
        throw new Error(
            'useLabelListContext must be used within a LabelListProvider'
        );
    }

    return context;
};
