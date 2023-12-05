import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

/* eslint-disable-next-line new-cap */
const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

/*
 * Color source:
 * https://coolors.co/222222-2d3032-3dbbfa-023047-425236-ffb703-fe7d02-fd4300
 */
const eerieBlack = 'hsl(0, 0%, 13%)';
const jet = 'hsl(204, 5%, 19%)';
const deepSkyBlue = {
    main: 'hsl(200, 95%, 61%)',
    light: 'hsl(200, 64%, 74%)', // result of color-mix(in hsl, #fff 33%, hsl(200, 95%, 61%))
    dark: 'hsl(200, 64%, 41%)', // result of color-mix(in hsl, #000 33%, hsl(200, 95%, 61%))
};
const prussianBlue = {
    main: 'hsl(200, 95%, 14%)',
    light: 'hsl(200, 64%, 42%)', // result of color-mix(in hsl, #fff 33%, hsl(200, 95%, 14%))
    dark: 'hsl(200, 62%, 9%)', // result of color-mix(in hsl, #000 33%, hsl(200, 95%, 14%))
};
const hunterGreen = {
    main: 'hsl(94, 21%, 27%)',
    light: 'hsl(94, 14%, 51%)', // result of color-mix(in hsl, #fff 33%, hsl(94, 21%, 27%))
    dark: 'hsl(97, 14%, 18%)', // result of color-mix(in hsl, #000 33%, hsl(94, 21%, 27%))
};
const selectiveYellow = {
    main: 'hsl(43, 100%, 51%)',
    light: 'hsl(43, 67%, 67%)', // result of color-mix(in hsl, #fff 33%, hsl(43, 100%, 51%))
    dark: 'hsl(43, 67%, 35%)', // result of color-mix(in hsl, #000 33%, hsl(43, 100%, 51%))
};
const orangeWheel = {
    main: 'hsl(29, 99%, 50%)',
    light: 'hsl(29, 66%, 67%)', // result of color-mix(in hsl, #fff 33%, hsl(29, 99%, 50%))
    dark: 'hsl(29, 66%, 34%)', // result of color-mix(in hsl, #000 33%, hsl(29, 99%, 50%))
};
const coquelicot = {
    main: 'hsl(16, 100%, 50%)',
    light: 'hsl(16, 67%, 67%)', // result of color-mix(in hsl, #fff 33%, hsl(16, 100%, 50%))
    dark: 'hsl(16, 67%, 34%)', // result of color-mix(in hsl, #000 33%, hsl(16, 100%, 50%))
};

const DARKEN_PERCENT = 33;
const LIGHTEN_PERCENT = 33;

/*
 * @TODO: remove the explicit light and dark values in favor of this when MUI supports color-mix
 *   https://github.com/mui/material-ui/issues/40104
 */
const makeColor = (color: string, contrast: string) => ({
    main: color,
    light: `color-mix(in hsl, #fff ${LIGHTEN_PERCENT}%, ${color})`,
    dark: `color-mix(in hsl, #000 ${DARKEN_PERCENT}%, ${color})`,
    contrastText: contrast,
});

export const theme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            xxl: 1920,
        },
    },
    palette: {
        mode: 'dark',
        primary: { ...prussianBlue, contrastText: '#fff' },
        secondary: { ...orangeWheel, contrastText: '#000' },
        error: { ...coquelicot, contrastText: '#000' },
        warning: { ...selectiveYellow, contrastText: '#000' },
        info: { ...deepSkyBlue, contrastText: '#000' },
        success: { ...hunterGreen, contrastText: '#fff' },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        body3: {
            fontSize: '0.75rem',
            fontWeight: 400,
            lineHeight: 1,
        },
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                root: ({ ownerState }) => ({
                    ...(ownerState.severity === 'info' && {
                        backgroundColor: '#60a5fa',
                    }),
                }),
            },
        },
        MuiLink: {
            styleOverrides: {
                root: {
                    color: deepSkyBlue.main,
                },
            },
        },
    },
});
