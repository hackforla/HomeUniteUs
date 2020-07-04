import { createMuiTheme } from '@material-ui/core/styles'

import { Theme } from '@material-ui/core/'

//fetch from server
const themeStyle = {
    name: 'registration',
    palette: {
        primary: {
            main: '#55B1EB',
            dark: '#136AA0',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: '#000',
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
            'Roboto',
            'Josefin Sans',
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            'Fira Sans',
            'Droid Sans',
            'Helvetica Neue',
            'sans-serif',
        ].join(', '),
    },
    shadows: ([] as unknown) as Theme['shadows'],
    // spacing: 16,

    //responsive calculation approach
    spacing: (factor: number) => `${factor}rem`,
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

/*** custom theme variable ***/
declare module '@material-ui/core/styles/createMuiTheme' {
    interface ThemeOptions {
        name?: string
    }
}

const { palette, typography, shadows, spacing, overrides, name } = themeStyle
export const theme = createMuiTheme({
    palette,
    typography,
    shadows,
    spacing,
    overrides,
    name,
})
