import * as React from 'react'
import { withStyles, WithStyles } from '@material-ui/core'
import { styles } from './styles'

import TextareaAutosize from '@material-ui/core/TextareaAutosize'

interface Props extends WithStyles<typeof styles> {}
const TextArea = (props: Props) => {
    return (
        <TextareaAutosize
            aria-label="minimum height"
            rowsMin={10}
            placeholder="Minimum 3 rows"
        />
    )
}

export default withStyles(styles)(TextArea)
