'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface LabelListSettings {
    order: 'asc' | 'desc';
    sort: 'name' | 'model_count';
    page: number;
    pageSize: number;
}

interface PartialLabelListSettings {
    order: 'asc' | 'desc' | null;
    sort: 'name' | 'model_count' | null;
    page: number | null;
    pageSize: number | null;
}

const defaults: LabelListSettings = {
    order: 'asc',
    sort: 'name',
    page: 0,
    pageSize: 25,
};

export const useLabelListSettings = () => {
    const searchParams = useSearchParams();

    const qsSettings = useMemo<PartialLabelListSettings>(() => {
        const retVal = {} as PartialLabelListSettings;

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

    const settings: LabelListSettings = useMemo(() => {
        if (typeof window === 'undefined') {
            return {
                ...defaults,
                ...qsSettings,
            };
        }

        const localSettings = JSON.parse(
            localStorage.getItem('labelListSettings') || '{}'
        );

        return {
            ...defaults,
            ...localSettings,
            ...qsSettings,
        };
    }, [qsSettings]);

    if (typeof window !== 'undefined') {
        localStorage.setItem('labelListSettings', JSON.stringify(settings));
    }

    return settings;
};
