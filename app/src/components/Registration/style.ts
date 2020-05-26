import { Theme, ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

declare module '@material-ui/core/styles/createMuiTheme' {
    // allow configuration using `createMuiTheme`
    interface ThemeOptions {
        PaletteOptions: {
            primary: string
        }
    }
}

import { createMuiTheme } from '@material-ui/core/styles'

export default function createMyTheme(options: ThemeOptions) {
    return createMuiTheme({
        PaletteOptions: {
            primary: 'F3F3F3',
        },
    })
}
