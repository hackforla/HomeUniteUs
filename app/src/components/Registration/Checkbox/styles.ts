import { createStyles } from '@material-ui/core'

/*This function doesn't really "do anything" at runtime, it's just the identity function.
Its only purpose is to defeat TypeScript's type widening when providing style rules to
makeStyles / withStyles which are a function of the Theme*/

export const styles = (theme: any) =>
    createStyles({
        checkbox: {
            color: theme.palette.primary.secondary, //<-- an example to showcase themeing
        },
    })

//a prop can be used on the component to conditionally render the correct style
