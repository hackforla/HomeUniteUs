import { Theme } from '@material-ui/core/'

/*modularized approach as a model for organization theming, these can be retrieved from server */

//fetches theme style
const themeStyle = {
    name: 'registration',
    palette: {
        primary: {
            main: '#55B1EB',
            dark: '#136AA0',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#999999',
            contrastText: '#FFFFFF',
        },
        error: {
            main: '#DA1414',
            light: '#F2DEDE',
            contrastText: '#FFFFFF',
        },
        warning: {
            main: '#FFBB33',
            light: '#F6EEE1',
            contrastText: '#FFFFFF',
        },
        success: {
            main: '#287D3C',
            light: '#E0E8E2',
            contrastText: '#FFFFFF',
        },
        info: {
            main: '#2E5AAC',
            light: '#E1E5ED',
            contrastText: '#FFFFFF',
        },
        text: {
            primary: '#2F2F2F',
        },
    },
    typography: {
        fontFamily: [
            'Josefin Sans',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            'Fira Sans',
            'Droid Sans',
            'Helvetica Neue',
            'sans-serif',
        ].join(''),
    },
    shadows: ([] as unknown) as Theme['shadows'],
    spacing: (factor: number) => `${0.25 * factor}rem`,
    overrides: {
        MuiButton: {
            // Name of the rule
            text: {
                // Some CSS
                color: 'white',
            },
        },
        MuiOutlinedInput: {
            root: {
                width: '650px',
                margin: '8px',
            },
        },
    },
}

export const themeName = themeStyle.name

export const palette = themeStyle.palette

export const typography = themeStyle.typography

export const shadows = themeStyle.shadows

// responsive function calculation
export const spacing = themeStyle.spacing

export const overrides = themeStyle.overrides
