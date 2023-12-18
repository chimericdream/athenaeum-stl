import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { Temporal } from 'temporal-polyfill';

import { useModelListContext } from '~/contexts/model-list-context';
import { type Model, loadModels } from '~/services/athenaeum';
import { rsToTemporal } from '~/util/dates';

interface ModelListOverrides {
    mode?: 'grid' | 'list';
    order?: 'asc' | 'desc';
}

export const useModelList = (overrides?: ModelListOverrides) => {
    const { mode, order, sort, subset } = useModelListContext();

    const sortFunc = useCallback(
        (left: Model, right: Model) => {
            let result = 0;

            if (sort === 'name') {
                result = left.name.localeCompare(right.name, 'en-US', {
                    caseFirst: 'lower',
                    numeric: true,
                    sensitivity: 'base',
                });
            }

            if (sort === 'date') {
                const lDate = rsToTemporal(left.imported_at);
                const rDate = rsToTemporal(right.imported_at);

                result = Temporal.Instant.compare(lDate, rDate);
            }

            const sortOrder = overrides?.order ?? order;

            return sortOrder === 'asc' ? result : -1 * result;
        },
        [order, overrides, sort]
    );

    const { data } = useQuery({ queryKey: ['models'], queryFn: loadModels });
    const models = useMemo(() => {
        const list = data ?? [];
        const sorted = list.toSorted(sortFunc);

        if (!subset) {
            return sorted;
        }

        return sorted.filter((model) => subset.includes(model.id));
    }, [data, sortFunc, subset]);

    return {
        models,
        settings: { mode, order },
    };
};
