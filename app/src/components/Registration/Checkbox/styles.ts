import { createStyles } from '@material-ui/core'

/*** createStyles is just the identity function; it doesn't "do anything" at runtime, 
 just helps guide type inference at compile time. ***/

export const styles = (theme: any) =>
    createStyles({
        checkbox: {
            color: theme.palette.primary.secondary, //<-- an example to showcase themeing
        },
    })

//a prop can be used on the component to conditionally render the correct style
