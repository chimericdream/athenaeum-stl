import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';

import { useModelListContext } from '~/contexts/model-list-context';
import {
    type Model,
    loadDeletedModels,
    loadModels,
} from '~/services/athenaeum';
import { rsToTemporal } from '~/util/dates';

interface ModelListOverrides {
    mode?: 'grid' | 'list';
    order?: 'asc' | 'desc';
    sort?: 'name' | 'date';
    includeNsfw?: boolean;
    isDeleted?: boolean;
}

export const useModelList = (overrides?: ModelListOverrides) => {
    const {
        fileFilters,
        includeNsfw,
        labelState,
        mode,
        order,
        sort,
        subset,
        withLink,
    } = useModelListContext();

    const sortFunc = useCallback(
        (left: Model, right: Model) => {
            let result = 0;

            const sortMethod = overrides?.sort ?? sort;

            if (sortMethod === 'name') {
                result = left.name.localeCompare(right.name, 'en-US', {
                    caseFirst: 'lower',
                    numeric: true,
                    sensitivity: 'base',
                });
            }

            if (sortMethod === 'date') {
                const lDate = rsToTemporal(left.imported_at);
                const rDate = rsToTemporal(right.imported_at);

                result = Temporal.Instant.compare(lDate, rDate);
            }

            const sortOrder = overrides?.order ?? order;

            return sortOrder === 'asc' ? result : -1 * result;
        },
        [order, overrides, sort]
    );

    const { data } = useQuery({
        queryKey: [overrides?.isDeleted ? 'deleted-models' : 'models'],
        queryFn: overrides?.isDeleted ? loadDeletedModels : loadModels,
    });
    const models = useMemo(() => {
        const list = data ?? [];
        const sorted = list.toSorted(sortFunc);

        let filtered;
        if (includeNsfw || overrides?.includeNsfw) {
            filtered = sorted;
        } else {
            filtered = sorted.filter((model) => !model.metadata?.nsfw);
        }

        if (overrides?.isDeleted) {
            filtered = filtered.filter((model) => model.deleted);
        }

        if (labelState === 'labeled') {
            filtered = filtered.filter((model) => model.labels?.length > 0);
        } else if (labelState === 'unlabeled') {
            filtered = filtered.filter((model) => model.labels?.length === 0);
        }

        if (withLink !== 'any') {
            filtered = filtered.filter((model) => {
                if (withLink === 'include') {
                    return !!model.metadata?.source_url;
                }

                return !model.metadata?.source_url;
            });
        }

        if (fileFilters.parts !== 'any') {
            filtered = filtered.filter((model) => {
                if (fileFilters.parts === 'include') {
                    return model.part_count > 0;
                }

                return model.part_count === 0;
            });
        }

        if (fileFilters.projects !== 'any') {
            filtered = filtered.filter((model) => {
                if (fileFilters.projects === 'include') {
                    return model.project_count > 0;
                }

                return model.project_count === 0;
            });
        }

        if (fileFilters.images !== 'any') {
            filtered = filtered.filter((model) => {
                if (fileFilters.images === 'include') {
                    return model.image_count > 0;
                }

                return model.image_count === 0;
            });
        }

        if (fileFilters.supportFiles !== 'any') {
            filtered = filtered.filter((model) => {
                if (fileFilters.supportFiles === 'include') {
                    return model.support_file_count > 0;
                }

                return model.support_file_count === 0;
            });
        }

        if (!subset) {
            return filtered;
        }

        return filtered.filter((model) => subset.includes(model.id));
    }, [
        data,
        fileFilters,
        includeNsfw,
        labelState,
        overrides,
        sortFunc,
        subset,
        withLink,
    ]);

    return {
        models,
        settings: { mode, order },
    };
};
