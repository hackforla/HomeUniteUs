import { createStyles } from '@material-ui/core'
export const styles = (theme: any) =>
    createStyles({
        paper: {
            display: 'flex',
            flexWrap: 'wrap',
            margin: theme.spacing(1),
            width: theme.spacing(20),
            height: theme.spacing(20),
            padding: theme.spacing(1),
            boxShadow:
                '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
        },
    })
