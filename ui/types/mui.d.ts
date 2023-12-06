// noinspection ES6UnusedImports
import '@mui/material/styles';
import type { TypeBackground } from '@mui/material/styles/createPalette';
import type {
    TypographyStyle,
    TypographyStyleOptions,
} from '@mui/material/styles/createTypography';

declare module '@mui/material' {
    export interface TypographyPropsVariantOverrides {
        body3: true;
    }
}

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xxl: true;
    }
}

declare module '@mui/material/styles/createPalette' {
    interface PaletteOptions {
        backgroundAlt?: Partial<TypeBackground>;
    }

    interface Palette {
        backgroundAlt: TypeBackground;
    }
}

declare module '@mui/material/styles/createTypography' {
    interface Typography {
        body3: TypographyStyle;
    }

    interface TypographyOptions {
        body3?: TypographyStyleOptions;
    }
}
