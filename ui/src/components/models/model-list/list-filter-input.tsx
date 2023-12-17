import CloseIcon from '@mui/icons-material/Close';
import { IconButton, InputAdornment, TextField } from '@mui/material';

import { useModelListContext } from '~/contexts/model-list-context';

export const ListFilterInput = () => {
    const { filter, setFilter } = useModelListContext();

    return (
        <TextField
            value={filter ?? ''}
            onChange={(e) => setFilter(e.target.value)}
            label="Search models"
            variant="outlined"
            sx={{
                lineHeight: 1.75,
                width: '32ch',
                '& label': {
                    transform: 'translate(1rem, 0.75rem) scale(1)',
                },
                '& label.Mui-focused, & label.MuiInputLabel-shrink': {
                    transform: 'translate(0.875rem, -0.5625rem) scale(0.75)',
                },
            }}
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
                sx: {
                    lineHeight: 1.75,
                    '& input': {
                        height: '1lh',
                        paddingBlock: '0.625rem',
                    },
                },
            }}
        />
    );
};
