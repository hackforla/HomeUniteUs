import { createMuiTheme } from '@material-ui/core/styles'
import {
    themeName,
    palette,
    typography,
    shadows,
    overrides,
    spacing,
} from './themeStyle'

/*** custom theme variable ***/
declare module '@material-ui/core/styles/createMuiTheme' {
    interface ThemeOptions {
        themeName?: string // optional
    }
}

export const theme = createMuiTheme({
    palette,
    typography,
    shadows,
    spacing,
    overrides,
    themeName,
})
