import CloseIcon from '@mui/icons-material/Close';
import { IconButton, InputAdornment, TextField } from '@mui/material';

import { useModelListContext } from '~/contexts/model-list-context';

export const ListFilterInput = () => {
    const { filter, setFilter } = useModelListContext();

    return (
        <TextField
            fullWidth
            value={filter ?? ''}
            onChange={(e) => setFilter(e.target.value)}
            label="Search models"
            variant="outlined"
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setFilter(null)}
                            edge="end"
                        >
                            <CloseIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};
