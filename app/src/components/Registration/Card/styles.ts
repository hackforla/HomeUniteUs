import { createStyles } from '@material-ui/core'
export const styles = (theme: any) =>
    createStyles({
        //example of additional classes for conditional styles used with theming
        //this may not be a great example as the baseline colors are defaulting to our theming, it is simply to illustrate
        card: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: theme.spacing(1),
            width: theme.spacing(14),
            height: theme.spacing(14),
            padding: theme.spacing(1),
        },
    })
