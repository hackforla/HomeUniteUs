import { createStyles } from '@material-ui/core'
export const styles = (theme: any) =>
    createStyles({
        //example of additional classes for conditional styles used with theming
        //this may not be a great example as the baseline colors are defaulting to our theming, it is simply to illustrate
        formControl: {
            color: theme.palette.primary.main,
        },
    })
