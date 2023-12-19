'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface ModelListSettings {
    mode: 'list' | 'grid';
    order: 'asc' | 'desc';
    sort: 'name';
    page: number;
    pageSize: number;
}

interface PartialModelListSettings {
    mode: 'list' | 'grid' | null;
    order: 'asc' | 'desc' | null;
    sort: 'name' | null;
    page: number | null;
    pageSize: number | null;
}

const defaults: ModelListSettings = {
    mode: 'list',
    order: 'asc',
    sort: 'name',
    page: 0,
    pageSize: 25,
};

export const useModelListSettings = () => {
    const searchParams = useSearchParams();

    const qsSettings = useMemo<PartialModelListSettings>(() => {
        const retVal = {} as PartialModelListSettings;

        if (searchParams.has('mode')) {
            retVal.mode = searchParams.get('mode') as 'list' | 'grid';
        }

        if (searchParams.has('order')) {
            retVal.order = searchParams.get('order') as 'asc' | 'desc';
        }

        if (searchParams.has('sort')) {
            retVal.sort = searchParams.get('sort') as 'name';
        }

        if (searchParams.has('page')) {
            retVal.page = parseInt(searchParams.get('page') as string, 10);
        }

        if (searchParams.has('pageSize')) {
            retVal.pageSize = parseInt(
                searchParams.get('pageSize') as string,
                10
            );
        }

        return retVal;
    }, [searchParams]);

    const settings: ModelListSettings = useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                ...defaults,
                ...qsSettings,
            };
        }

        const localSettings = JSON.parse(
            localStorage.getItem('modelListSettings') || '{}'
        );

        return {
            ...defaults,
            ...localSettings,
            ...qsSettings,
        };
    }, [qsSettings]);

    if (typeof window !== 'undefined') {
        localStorage.setItem('modelListSettings', JSON.stringify(settings));
    }

    return settings;
};
