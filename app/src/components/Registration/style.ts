import { createMuiTheme } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'

// []colors
// []fonts
// []overrides: input, cssbaseline global font
// []individual style sheets
// []withStyles HOC api
// []dynamic adjustments to text input width & height

export const theme = createMuiTheme({
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
    overrides: {
        MuiInputBase: {
            root: {
                background: '#FFFFFF',
                borderRadius: '50px',
                boxShadow: '0px 2px 5px 2px rgba(0, 0, 0, 0.10)',
            },
        },
        MuiTextField: {
            root: {
                background: '#FFFFFF',
                width: '800px',
                boxShadow: '0px 2px 5px 2px rgba(0, 0, 0, 0.10)',
            },
        },
    },
})
