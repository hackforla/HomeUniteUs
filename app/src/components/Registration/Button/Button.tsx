import React from 'react'
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1),
        },
    })
)

interface Props {
    id: string
    name: string
    value: string
    onClick: (event: object) => void
    label: string
}

export default withStyles(styles)(function ButtonSizes(props: Props) {
    const classes = useStyles()
    const { label, name, value, id } = props

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
                    className={classes.margin}
                >
                    {label}
                </Button>
            </div>
        </div>
    )
})
