import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

interface Props {
    id: string
    name: string
    value: string
    onClick: (event: object) => void
    label: string
    classes: {
        root: string
    }
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
