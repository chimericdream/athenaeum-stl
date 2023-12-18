import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

import { useLabelListContext } from '~/contexts/label-list-context';
import { type LabelEntry, loadLabels } from '~/services/athenaeum';

interface LabelListOverrides {
    order?: 'asc' | 'desc';
}

export const useLabelList = (overrides?: LabelListOverrides) => {
    const { order, sort } = useLabelListContext();

    const sortFunc = useCallback(
        (left: LabelEntry, right: LabelEntry) => {
            let result = 0;

            if (sort === 'name') {
                result = left.name.localeCompare(right.name, 'en-US', {
                    caseFirst: 'lower',
                    numeric: true,
                    sensitivity: 'base',
                });
            }

            if (sort === 'model_count') {
                result = left.model_count - right.model_count;
            }

            const sortOrder = overrides?.order ?? order;

            return sortOrder === 'asc' ? result : -1 * result;
        },
        [order, overrides, sort]
    );

    const { data } = useQuery({ queryKey: ['labels'], queryFn: loadLabels });
    const labels = useMemo(() => {
        const list = data ?? [];

        return list.toSorted(sortFunc);
    }, [data, sortFunc]);

    return {
        labels,
        settings: { order },
    };
};
