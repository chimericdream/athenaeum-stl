'use client';

import {
    type AutocompleteRenderInputParams,
    CircularProgress,
    type FilterOptionsState,
    InputAdornment,
    TextField,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    type HTMLAttributes,
    type SyntheticEvent,
    useCallback,
    useState,
} from 'react';

import { type Label, createLabel, loadLabels } from '~/services/athenaeum';

interface FilteredLabel extends Partial<Label> {
    inputValue?: string;
}

const filter = createFilterOptions<FilteredLabel>();

export const AddLabelInput = () => {
    const [value, setValue] = useState<FilteredLabel | null>(null);

    const queryClient = useQueryClient();

    const { data } = useQuery({
        queryKey: ['labels'],
        queryFn: () => loadLabels(),
    });

    const allLabels = data ?? [];

    const { isPending, mutate, reset } = useMutation<Label, Error, string>({
        mutationFn: createLabel,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['labels'] });
            setValue(null);
            reset();
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
                // Create a new label
                mutate(newValue.inputValue);
                setValue({
                    name: newValue.inputValue,
                });
            } else {
                // This shouldn't happen if all existing labels are unable to be selected
                setValue(newValue);
            }
        },
        [mutate, setValue]
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
                filtered.unshift({
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

    const optionExists = useCallback((option: FilteredLabel) => {
        return typeof option?.id === 'string' && option.id.length > 0;
    }, []);

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
            getOptionDisabled={optionExists}
            getOptionLabel={getOptionLabel}
            renderInput={renderInput}
            renderOption={renderOption}
        />
    );
};
