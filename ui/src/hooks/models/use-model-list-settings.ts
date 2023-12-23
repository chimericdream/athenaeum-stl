'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

interface ModelListSettings {
    mode: 'list' | 'grid';
    order: 'asc' | 'desc';
    sort: 'name';
    labels: 'all' | 'labeled' | 'unlabeled';
    fileFilters: {
        parts: 'include' | 'exclude' | 'any';
        projects: 'include' | 'exclude' | 'any';
        images: 'include' | 'exclude' | 'any';
        supportFiles: 'include' | 'exclude' | 'any';
    };
    page: number;
    withLink: 'include' | 'exclude' | 'any';
    pageSize: number;
    reset: () => void;
}

interface PartialModelListSettings {
    mode: 'list' | 'grid' | null;
    order: 'asc' | 'desc' | null;
    sort: 'name' | null;
    labels: 'all' | 'labeled' | 'unlabeled' | null;
    fileFilters: {
        parts?: 'include' | 'exclude' | 'any' | null;
        projects?: 'include' | 'exclude' | 'any' | null;
        images?: 'include' | 'exclude' | 'any' | null;
        supportFiles?: 'include' | 'exclude' | 'any' | null;
    };
    withLink: 'include' | 'exclude' | 'any' | null;
    page: number | null;
    pageSize: number | null;
}

const defaults: ModelListSettings = {
    mode: 'list',
    order: 'asc',
    sort: 'name',
    labels: 'all',
    fileFilters: {
        parts: 'any',
        projects: 'any',
        images: 'any',
        supportFiles: 'any',
    },
    withLink: 'any',
    page: 0,
    pageSize: 100,
    reset: () => {},
};

export const useModelListSettings = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const qsSettings = useMemo<PartialModelListSettings>(() => {
        const retVal = {} as PartialModelListSettings;

        if (searchParams.has('mode')) {
            retVal.mode = searchParams.get('mode') as ModelListSettings['mode'];
        }

        if (searchParams.has('labels')) {
            retVal.labels = searchParams.get(
                'labels'
            ) as ModelListSettings['labels'];
        }

        if (searchParams.has('order')) {
            retVal.order = searchParams.get(
                'order'
            ) as ModelListSettings['order'];
        }

        if (searchParams.has('sort')) {
            retVal.sort = searchParams.get('sort') as ModelListSettings['sort'];
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

        if (searchParams.has('withLink')) {
            retVal.withLink = searchParams.get(
                'withLink'
            ) as ModelListSettings['withLink'];
        }

        retVal.fileFilters = {};

        if (searchParams.has('parts')) {
            retVal.fileFilters.parts = searchParams.get(
                'parts'
            ) as ModelListSettings['fileFilters']['parts'];
        }

        if (searchParams.has('projects')) {
            retVal.fileFilters.projects = searchParams.get(
                'projects'
            ) as ModelListSettings['fileFilters']['projects'];
        }

        if (searchParams.has('images')) {
            retVal.fileFilters.images = searchParams.get(
                'images'
            ) as ModelListSettings['fileFilters']['images'];
        }

        if (searchParams.has('supportFiles')) {
            retVal.fileFilters.supportFiles = searchParams.get(
                'supportFiles'
            ) as ModelListSettings['fileFilters']['supportFiles'];
        }

        return retVal;
    }, [searchParams]);

    const reset = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem('modelListSettings', JSON.stringify(defaults));
        router.push(pathname);
    }, [pathname, router]);

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
            fileFilters: {
                ...(defaults.fileFilters ?? {}),
                ...(localSettings.fileFilters ?? {}),
                ...(qsSettings.fileFilters ?? {}),
            },
            reset,
        };
    }, [qsSettings, reset]);

    if (typeof window !== 'undefined') {
        localStorage.setItem('modelListSettings', JSON.stringify(settings));
    }

    return settings;
};
