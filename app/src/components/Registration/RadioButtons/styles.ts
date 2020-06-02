import { createStyles } from '@material-ui/core'
export const styles = (theme: any) =>
    createStyles({
        //example of additional classes for conditional styles used with theming
        formControl: {
            color: theme.palette.primary.main,
        },
    })
