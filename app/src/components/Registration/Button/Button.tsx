import React from 'react'
import Button from '@material-ui/core/Button'
import { withStyles, WithStyles } from '@material-ui/core/'
import { styles } from './styles'

interface Props extends WithStyles<typeof styles> {
    id: string
    name: string
    value: string
    onClick: (event: object) => void
    label: string
}

export default withStyles(styles)(function SimpleButton(props: Props) {
    const { label, name, value, id, classes } = props

    return (
        <div>
            <div>
                <Button
                    variant="contained"
                    name={name}
                    id={id}
                    value={value}
                    size="large"
                    color="primary"
                    className={classes.root}
                >
                    {label}
                </Button>
            </div>
        </div>
    )
})
