import { Box } from '@mui/material';

export default async function Page() {
    return (
        <Box
            component="div"
            sx={{
                width: {
                    xs: '100%',
                    sm: '50%',
                    md: '66.66%',
                    xl: '75%',
                },
            }}
        >
            <Box component="div">Home</Box>
        </Box>
    );
}
