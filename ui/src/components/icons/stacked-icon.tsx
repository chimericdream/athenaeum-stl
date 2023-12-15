import { Box } from '@mui/material';
import { Children, type PropsWithChildren as PWC } from 'react';

export const StackedIcon = ({ children }: PWC) => {
    const icons = Children.toArray(children);

    return (
        <Box
            component="span"
            sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                height: '1lh',
                width: '1lh',
                position: 'relative',
            }}
        >
            {icons.map((icon, index) => (
                <Box
                    key={index}
                    component="span"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        zIndex: index,
                    }}
                >
                    {icon}
                </Box>
            ))}
        </Box>
    );
};
