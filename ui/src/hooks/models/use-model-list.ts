import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useModelListContext } from '~/contexts/model-list-context';
import { type Model, loadModels } from '~/services/athenaeum';

interface ModelListOverrides {
    mode?: 'grid' | 'list';
    order?: 'asc' | 'desc';
}

export const useModelList = (overrides?: ModelListOverrides) => {
    const { mode, order } = useModelListContext();

    const sortFunc = useCallback(
        (left: Model, right: Model) => {
            const result = left.name.localeCompare(right.name, 'en-US', {
                caseFirst: 'lower',
                numeric: true,
                sensitivity: 'base',
            });

            const sortOrder = overrides?.order ?? order;

            return sortOrder === 'asc' ? result : -1 * result;
        },
        [order, overrides]
    );

    const { data } = useQuery({ queryKey: ['models'], queryFn: loadModels });
    const models = useMemo(() => {
        const list = data ?? [];

        return list.toSorted(sortFunc);
    }, [data, sortFunc]);

    return {
        models,
        settings: { mode, order },
    };
};
