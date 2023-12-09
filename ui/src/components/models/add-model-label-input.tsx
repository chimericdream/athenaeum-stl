'use client';

import {
    TextField,
    type FilterOptionsState,
    type AutocompleteRenderInputParams,
    InputAdornment,
    CircularProgress,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    useCallback,
    useMemo,
    useState,
    type SyntheticEvent,
    type HTMLAttributes,
} from 'react';

import {
    addLabelToModel,
    loadLabels,
    type Label,
    type ModelRecord,
    type NewLabel,
    loadModel,
} from '~/services/athenaeum';

interface FilteredLabel extends Partial<Label> {
    inputValue?: string;
}

const filter = createFilterOptions<FilteredLabel>();

export const AddModelLabelInput = ({ modelId }: { modelId: string }) => {
    const [value, setValue] = useState<FilteredLabel | null>(null);

    const queryClient = useQueryClient();

    const { data: model } = useQuery({
        queryKey: ['models', modelId],
        queryFn: () => loadModel(modelId),
    });
    const { data } = useQuery({
        queryKey: ['labels'],
        queryFn: () => loadLabels(),
    });

    const allLabels = useMemo(() => data ?? [], [data]);

    const { isPending, mutate, reset } = useMutation<
        ModelRecord,
        Error,
        { id: string; label: Label | NewLabel }
    >({
        mutationFn: addLabelToModel,
        onSuccess: async (model) => {
            await queryClient.invalidateQueries({ queryKey: ['labels'] });
            await queryClient.invalidateQueries({
                queryKey: ['models', modelId],
            });
            setValue(null);
        },
    });

    // When the user actually selects a label
    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: string | FilteredLabel | null) => {
            if (typeof newValue === 'string') {
                // I probably don't want this
                setValue({
                    name: `${newValue}---how did this happen`,
                });
            } else if (newValue?.inputValue) {
                // Create a new tag, then add it to the model
                mutate({
                    id: modelId,
                    label: {
                        name: newValue.inputValue,
                    },
                });
                setValue({
                    name: newValue.inputValue,
                });
            } else {
                // Add an existing label to the model
                mutate({
                    id: modelId,
                    label: {
                        id: newValue!.id!,
                        name: newValue!.name!,
                    },
                });
                setValue(newValue);
            }
        },
        [modelId, mutate, setValue]
    );

    // While the user is typing
    const handleFilter = useCallback(
        (
            options: FilteredLabel[],
            params: FilterOptionsState<FilteredLabel>
        ) => {
            const filtered = filter(options, params);

            const { inputValue } = params;
            // Suggest the creation of a new value
            const isExisting = options.some(
                (option) => inputValue === option.name
            );
            if (inputValue !== '' && !isExisting) {
                filtered.push({
                    inputValue,
                    name: `Add "${inputValue}"`,
                });
            }

            return filtered;
        },
        []
    );

    const getOptionLabel = useCallback((option: string | FilteredLabel) => {
        // Value selected with enter, right from the input
        if (typeof option === 'string') {
            return option;
        }

        // Add "xxx" option created dynamically
        if (option.inputValue) {
            return option.inputValue;
        }

        // Regular option
        return option.name!;
    }, []);

    const optionExistsOnModel = useCallback(
        (option: FilteredLabel) => {
            return model!.labels.some((label) => label.label_id === option.id);
        },
        [model]
    );

    const renderOption = useCallback(
        (props: HTMLAttributes<HTMLLIElement>, option: FilteredLabel) => (
            <li {...props}>{option.name}</li>
        ),
        []
    );

    const renderInput = useCallback(
        (params: AutocompleteRenderInputParams) => (
            <TextField
                {...params}
                label="Add label"
                InputProps={{
                    ...params.InputProps,
                    endAdornment: isPending && (
                        <InputAdornment position="end">
                            <CircularProgress />
                        </InputAdornment>
                    ),
                }}
            />
        ),
        [isPending]
    );

    return (
        <Autocomplete
            clearOnBlur
            freeSolo
            handleHomeEndKeys
            selectOnFocus
            value={value}
            onChange={handleChange}
            filterOptions={handleFilter}
            id="add-label-input"
            options={allLabels}
            getOptionDisabled={optionExistsOnModel}
            getOptionLabel={getOptionLabel}
            renderInput={renderInput}
            renderOption={renderOption}
        />
    );
};
