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
    useMemo,
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

    const allLabels = useMemo(() => {
        return data ?? [];
    }, [data]);

    const { isPending, mutate, reset } = useMutation<Label, Error, string>({
        mutationFn: createLabel,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['labels'] });
            setValue(null);
            reset();
        },
    });

    const labelExists = useCallback(
        (label: string) => {
            return allLabels.some((l) => l.name === label);
        },
        [allLabels]
    );

    // When the user actually selects a label
    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: string | FilteredLabel | null) => {
            if (typeof newValue === 'string') {
                if (!labelExists(newValue)) {
                    // Create a new label
                    mutate(newValue);
                    setValue({
                        name: newValue,
                    });
                }
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
        [labelExists, mutate, setValue]
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
                    sx: {
                        lineHeight: 1.75,
                        '& input': {
                            height: '1lh',
                            padding: '0.625rem 0 0.625rem 14px !important',
                        },
                    },
                }}
                sx={{
                    lineHeight: 1.75,
                    '& label': {
                        transform: 'translate(1rem, 0.75rem) scale(1)',
                    },
                    '& label.Mui-focused, & label.MuiInputLabel-shrink': {
                        transform:
                            'translate(0.875rem, -0.5625rem) scale(0.75)',
                    },
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
            sx={{
                '& .MuiOutlinedInput-root': {
                    padding: 0,
                },
            }}
        />
    );
};
