import { createMuiTheme } from '@material-ui/core/styles'

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
            main: '#55B1EB',
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
})
