import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'
import Paper from '@material-ui/core/Paper'

interface Props {
    classes: {
        card: string
    }
}

export default withStyles(styles)(function SimplePaper(props: Props) {
    const { classes } = props
    return (
        <div>
            <Paper className={classes.paper} elevation={elevation} />
        </div>
    )
})
