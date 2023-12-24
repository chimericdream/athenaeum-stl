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
    useEffect,
    useState,
} from 'react';

import { useModelListSettings } from '~/hooks/models/use-model-list-settings';

type ToggleUpdater<V = 'include' | 'exclude' | 'any'> = (
    e: MouseEvent<HTMLElement>,
    value: V | null
) => void;

export interface ModelListContextType {
    subset: null | string[];
    filter: string | null;
    mode: 'grid' | 'list';
    order: 'asc' | 'desc';
    sort: 'name' | 'date';
    page: number;
    pageSize: 25 | 50 | 100;
    labelState: 'all' | 'labeled' | 'unlabeled';
    fileFilters: {
        parts: 'include' | 'exclude' | 'any';
        projects: 'include' | 'exclude' | 'any';
        images: 'include' | 'exclude' | 'any';
        supportFiles: 'include' | 'exclude' | 'any';
    };
    fileFilterUpdaters: {
        parts: ToggleUpdater;
        projects: ToggleUpdater;
        images: ToggleUpdater;
        supportFiles: ToggleUpdater;
    };
    handleLabelStateChange: ToggleUpdater<'all' | 'labeled' | 'unlabeled'>;
    includeNsfw: boolean | null;
    handleNsfwChange: ToggleUpdater<boolean | 'null'>;
    withLink: 'include' | 'exclude' | 'any';
    handleWithLinkChange: ToggleUpdater;
    setFilter: (filter: string | null) => void;
    setSubset: (subset: null | string[]) => void;
    updatePagination: (
        model: GridPaginationModel,
        details: GridCallbackDetails
    ) => void;
    handleModeChange: ToggleUpdater<'grid' | 'list'>;
    handleSortOrderChange: ToggleUpdater<
        'name|asc' | 'name|desc' | 'date|asc' | 'date|desc'
    >;
    reset: () => void;
}

export const ModelListContext = createContext<ModelListContextType>({
    subset: null,
    filter: null,
    mode: 'list',
    order: 'asc',
    sort: 'name',
    page: 0,
    pageSize: 25,
    labelState: 'all',
    fileFilters: {
        parts: 'any',
        projects: 'any',
        images: 'any',
        supportFiles: 'any',
    },
    fileFilterUpdaters: {
        parts: () => {},
        projects: () => {},
        images: () => {},
        supportFiles: () => {},
    },
    handleLabelStateChange: () => {},
    includeNsfw: false,
    withLink: 'any',
    handleWithLinkChange: () => {},
    handleNsfwChange: () => {},
    setSubset: () => {},
    setFilter: () => {},
    updatePagination: () => {},
    handleModeChange: () => {},
    handleSortOrderChange: () => {},
    reset: () => {},
});

export const ModelListProvider = ({ children }: PWC) => {
    const [filter, setFilter] = useState<string | null>(null);
    const [subset, setSubset] = useState<string[] | null>(null);
    const [includeNsfw, setNsfw] = useState<boolean | null>(false);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const {
        fileFilters,
        labels,
        mode,
        order,
        sort,
        page,
        pageSize,
        reset,
        withLink,
    } = useModelListSettings();

    const makeQueryString = useCallback(
        (updates: { [key: string]: string }, removals: string[] = []) => {
            const params = new URLSearchParams(searchParams);
            Object.entries(updates).forEach(([name, value]) => {
                params.set(name, value);
            });

            removals.forEach((name) => {
                params.delete(name);
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
        (_: MouseEvent<HTMLElement>, newMode: 'grid' | 'list' | null) => {
            router.push(
                `${pathname}?${makeQueryString({ mode: newMode ?? 'list' })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    const handleNsfwChange = useCallback(
        (_: MouseEvent<HTMLElement>, newMode: boolean | 'null' | null) => {
            if (newMode === 'null') {
                setNsfw(null);
                return;
            }
            setNsfw(newMode);
        },
        [setNsfw]
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

    const handleLabelStateChange = useCallback(
        (
            _: MouseEvent<HTMLElement>,
            value: 'all' | 'labeled' | 'unlabeled' | null
        ) => {
            router.push(
                `${pathname}?${makeQueryString({ labels: value ?? 'all' })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    const handleWithLinkChange = useCallback(
        (
            _: MouseEvent<HTMLElement>,
            value: 'include' | 'exclude' | 'any' | null
        ) => {
            router.push(
                `${pathname}?${makeQueryString({
                    withLink: value ?? 'any',
                })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    const handlePartFilterChange = useCallback(
        (
            _: MouseEvent<HTMLElement>,
            value: 'include' | 'exclude' | 'any' | null
        ) => {
            router.push(
                `${pathname}?${makeQueryString({ parts: value ?? 'any' })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    const handleProjectFilterChange = useCallback(
        (
            _: MouseEvent<HTMLElement>,
            value: 'include' | 'exclude' | 'any' | null
        ) => {
            router.push(
                `${pathname}?${makeQueryString({ projects: value ?? 'any' })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    const handleImageFilterChange = useCallback(
        (
            _: MouseEvent<HTMLElement>,
            value: 'include' | 'exclude' | 'any' | null
        ) => {
            router.push(
                `${pathname}?${makeQueryString({ images: value ?? 'any' })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    const handleSupportFileFilterChange = useCallback(
        (
            _: MouseEvent<HTMLElement>,
            value: 'include' | 'exclude' | 'any' | null
        ) => {
            router.push(
                `${pathname}?${makeQueryString({
                    supportFiles: value ?? 'any',
                })}`
            );
        },
        [makeQueryString, pathname, router]
    );

    useEffect(() => {
        const shouldReset = searchParams.has('reset');
        if (shouldReset) {
            setFilter(null);
            setSubset(null);
            setNsfw(false);
            router.push(pathname);
        }
    }, [pathname, reset, router, searchParams]);

    const ctx: ModelListContextType = {
        subset,
        filter,
        mode,
        order,
        sort,
        page,
        pageSize,
        fileFilters,
        fileFilterUpdaters: {
            parts: handlePartFilterChange,
            projects: handleProjectFilterChange,
            images: handleImageFilterChange,
            supportFiles: handleSupportFileFilterChange,
        },
        labelState: labels,
        handleLabelStateChange,
        includeNsfw,
        handleNsfwChange,
        withLink,
        handleWithLinkChange,
        setFilter,
        setSubset,
        updatePagination,
        handleModeChange,
        handleSortOrderChange,
        reset,
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
