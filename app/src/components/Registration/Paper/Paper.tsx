import React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/'
import { styles } from './styles'
import Paper from '@material-ui/core/Paper'

interface Props extends WithStyles<typeof styles> {
    elevation: number
}

export default withStyles(styles)(function SimplePaper(props: Props) {
    const { classes, elevation } = props
    return (
        <div>
            <Paper className={classes.paper} elevation={elevation} />
        </div>
    )
})
