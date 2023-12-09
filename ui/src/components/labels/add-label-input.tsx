'use client';

import {
    CircularProgress,
    InputAdornment,
    TextField,
    type FilterOptionsState,
    type AutocompleteRenderInputParams,
} from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    useCallback,
    useState,
    type SyntheticEvent,
    type HTMLAttributes,
} from 'react';

import { createLabel, loadLabels, type Label } from '~/services/athenaeum';

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
        onSuccess: async (model) => {
            await queryClient.invalidateQueries({ queryKey: ['labels'] });
            setValue(null);
        },
    });

    const save = useCallback(
        (name: string) => {
            mutate(name);
        },
        [mutate]
    );

    // When the user actually selects a label
    const handleChange = useCallback(
        (event: SyntheticEvent, newValue: string | FilteredLabel | null) => {
            if (typeof newValue === 'string') {
                // I probably don't want this
                setValue({
                    name: newValue,
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
        []
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

interface FilmOptionType {
    inputValue?: string;
    name: string;
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films: FilmOptionType[] = [
    { name: 'The Shawshank Redemption' },
    { name: 'The Godfather' },
    { name: 'The Godfather: Part II' },
    { name: 'The Dark Knight' },
    { name: '12 Angry Men' },
    { name: "Schindler's List" },
    { name: 'Pulp Fiction' },
    { name: 'The Lord of the Rings: The Return of the King' },
    { name: 'The Good, the Bad and the Ugly' },
    { name: 'Fight Club' },
    { name: 'The Lord of the Rings: The Fellowship of the Ring' },
    { name: 'Star Wars: Episode V - The Empire Strikes Back' },
    { name: 'Forrest Gump' },
    { name: 'Inception' },
    { name: 'The Lord of the Rings: The Two Towers' },
    { name: "One Flew Over the Cuckoo's Nest" },
    { name: 'Goodfellas' },
    { name: 'The Matrix' },
    { name: 'Seven Samurai' },
    { name: 'Star Wars: Episode IV - A New Hope' },
    { name: 'City of God' },
    { name: 'Se7en' },
    { name: 'The Silence of the Lambs' },
    { name: "It's a Wonderful Life" },
    { name: 'Life Is Beautiful' },
    { name: 'The Usual Suspects' },
    { name: 'Léon: The Professional' },
    { name: 'Spirited Away' },
    { name: 'Saving Private Ryan' },
    { name: 'Once Upon a Time in the West' },
    { name: 'American History X' },
    { name: 'Interstellar' },
    { name: 'Casablanca' },
    { name: 'City Lights' },
    { name: 'Psycho' },
    { name: 'The Green Mile' },
    { name: 'The Intouchables' },
    { name: 'Modern Times' },
    { name: 'Raiders of the Lost Ark' },
    { name: 'Rear Window' },
    { name: 'The Pianist' },
    { name: 'The Departed' },
    { name: 'Terminator 2: Judgment Day' },
    { name: 'Back to the Future' },
    { name: 'Whiplash' },
    { name: 'Gladiator' },
    { name: 'Memento' },
    { name: 'The Prestige' },
    { name: 'The Lion King' },
    { name: 'Apocalypse Now' },
    { name: 'Alien' },
    { name: 'Sunset Boulevard' },
    {
        name: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    },
    { name: 'The Great Dictator' },
    { name: 'Cinema Paradiso' },
    { name: 'The Lives of Others' },
    { name: 'Grave of the Fireflies' },
    { name: 'Paths of Glory' },
    { name: 'Django Unchained' },
    { name: 'The Shining' },
    { name: 'WALL·E' },
    { name: 'American Beauty' },
    { name: 'The Dark Knight Rises' },
    { name: 'Princess Mononoke' },
    { name: 'Aliens' },
    { name: 'Oldboy' },
    { name: 'Once Upon a Time in America' },
    { name: 'Witness for the Prosecution' },
    { name: 'Das Boot' },
    { name: 'Citizen Kane' },
    { name: 'North by Northwest' },
    { name: 'Vertigo' },
    { name: 'Star Wars: Episode VI - Return of the Jedi' },
    { name: 'Reservoir Dogs' },
    { name: 'Braveheart' },
    { name: 'M' },
    { name: 'Requiem for a Dream' },
    { name: 'Amélie' },
    { name: 'A Clockwork Orange' },
    { name: 'Like Stars on Earth' },
    { name: 'Taxi Driver' },
    { name: 'Lawrence of Arabia' },
    { name: 'Double Indemnity' },
    { name: 'Eternal Sunshine of the Spotless Mind' },
    { name: 'Amadeus' },
    { name: 'To Kill a Mockingbird' },
    { name: 'Toy Story 3' },
    { name: 'Logan' },
    { name: 'Full Metal Jacket' },
    { name: 'Dangal' },
    { name: 'The Sting' },
    { name: '2001: A Space Odyssey' },
    { name: "Singin' in the Rain" },
    { name: 'Toy Story' },
    { name: 'Bicycle Thieves' },
    { name: 'The Kid' },
    { name: 'Inglourious Basterds' },
    { name: 'Snatch' },
    { name: '3 Idiots' },
    { name: 'Monty Python and the Holy Grail' },
];
