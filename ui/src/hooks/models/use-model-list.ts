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
    includeNsfw?: boolean | null;
    fileFilters?: {
        parts?: 'any' | 'include' | 'exclude';
        projects?: 'any' | 'include' | 'exclude';
        images?: 'any' | 'include' | 'exclude';
        supportFiles?: 'any' | 'include' | 'exclude';
    };
    labelState?: 'all' | 'labeled' | 'unlabeled';
    subset?: string[] | null;
    withLink?: 'any' | 'include' | 'exclude';
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

    const listConfigs = useMemo(() => {
        const configs = {
            fileFilters,
            includeNsfw,
            labelState,
            mode,
            order,
            sort,
            subset,
            withLink,
        };

        if (overrides?.fileFilters?.parts) {
            configs.fileFilters.parts = overrides.fileFilters.parts;
        }
        if (overrides?.fileFilters?.projects) {
            configs.fileFilters.projects = overrides.fileFilters.projects;
        }
        if (overrides?.fileFilters?.images) {
            configs.fileFilters.images = overrides.fileFilters.images;
        }
        if (overrides?.fileFilters?.supportFiles) {
            configs.fileFilters.supportFiles =
                overrides.fileFilters.supportFiles;
        }
        if (typeof overrides?.includeNsfw !== 'undefined') {
            configs.includeNsfw = overrides.includeNsfw;
        }
        if (overrides?.labelState) {
            configs.labelState = overrides.labelState;
        }
        if (overrides?.mode) {
            configs.mode = overrides.mode;
        }
        if (overrides?.order) {
            configs.order = overrides.order;
        }
        if (overrides?.sort) {
            configs.sort = overrides.sort;
        }
        if (overrides?.subset) {
            configs.subset = overrides.subset;
        }
        if (overrides?.withLink) {
            configs.withLink = overrides.withLink;
        }

        return configs;
    }, [
        fileFilters,
        includeNsfw,
        labelState,
        mode,
        order,
        overrides,
        sort,
        subset,
        withLink,
    ]);

    const sortFunc = useCallback(
        (left: Model, right: Model) => {
            let result = 0;

            if (listConfigs.sort === 'name') {
                result = left.name.localeCompare(right.name, 'en-US', {
                    caseFirst: 'lower',
                    numeric: true,
                    sensitivity: 'base',
                });
            }

            if (listConfigs.sort === 'date') {
                const lDate = rsToTemporal(left.imported_at);
                const rDate = rsToTemporal(right.imported_at);

                result = Temporal.Instant.compare(lDate, rDate);
            }

            return listConfigs.order === 'asc' ? result : -1 * result;
        },
        [listConfigs]
    );

    const { data } = useQuery({
        queryKey: [overrides?.isDeleted ? 'deleted-models' : 'models'],
        queryFn: overrides?.isDeleted ? loadDeletedModels : loadModels,
    });
    const models = useMemo(() => {
        const list = data ?? [];
        const sorted = list.toSorted(sortFunc);

        let filtered = sorted;
        if (listConfigs.includeNsfw !== null) {
            if (listConfigs.includeNsfw) {
                filtered = sorted.filter((model) =>
                    Boolean(model.metadata?.nsfw)
                );
            } else {
                filtered = sorted.filter(
                    (model) => !Boolean(model.metadata?.nsfw)
                );
            }
        }

        if (overrides?.isDeleted) {
            filtered = filtered.filter((model) => model.deleted);
        }

        if (listConfigs.labelState === 'labeled') {
            filtered = filtered.filter((model) => model.labels?.length > 0);
        } else if (listConfigs.labelState === 'unlabeled') {
            filtered = filtered.filter((model) => model.labels?.length === 0);
        }

        if (listConfigs.withLink !== 'any') {
            filtered = filtered.filter((model) => {
                if (listConfigs.withLink === 'include') {
                    return !!model.metadata?.source_url;
                }

                return !model.metadata?.source_url;
            });
        }

        if (listConfigs.fileFilters.parts !== 'any') {
            filtered = filtered.filter((model) => {
                if (listConfigs.fileFilters.parts === 'include') {
                    return model.part_count > 0;
                }

                return model.part_count === 0;
            });
        }

        if (listConfigs.fileFilters.projects !== 'any') {
            filtered = filtered.filter((model) => {
                if (listConfigs.fileFilters.projects === 'include') {
                    return model.project_count > 0;
                }

                return model.project_count === 0;
            });
        }

        if (listConfigs.fileFilters.images !== 'any') {
            filtered = filtered.filter((model) => {
                if (listConfigs.fileFilters.images === 'include') {
                    return model.image_count > 0;
                }

                return model.image_count === 0;
            });
        }

        if (listConfigs.fileFilters.supportFiles !== 'any') {
            filtered = filtered.filter((model) => {
                if (listConfigs.fileFilters.supportFiles === 'include') {
                    return model.support_file_count > 0;
                }

                return model.support_file_count === 0;
            });
        }

        if (!listConfigs.subset) {
            return filtered;
        }

        return filtered.filter((model) =>
            listConfigs.subset!.includes(model.id)
        );
    }, [data, listConfigs, overrides, sortFunc]);

    return {
        models,
        settings: { mode, order },
    };
};
