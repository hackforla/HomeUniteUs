import React from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        margin: {
            margin: theme.spacing(1),
        },
        extendedIcon: {
            marginRight: theme.spacing(1),
        },
    })
)

export default function ButtonSizes() {
    const classes = useStyles()

    return (
        <div>
            <div>
                <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    className={classes.margin}
                >
                    Small
                </Button>
                <Button
                    variant="outlined"
                    size="medium"
                    color="primary"
                    className={classes.margin}
                >
                    Medium
                </Button>
                <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    className={classes.margin}
                >
                    Large
                </Button>
            </div>
            <div>
                <Button
                    variant="contained"
                    size="small"
                    color="primary"
                    className={classes.margin}
                >
                    Small
                </Button>
                <Button
                    variant="contained"
                    size="medium"
                    color="primary"
                    className={classes.margin}
                >
                    Medium
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    color="primary"
                    className={classes.margin}
                >
                    Large
                </Button>
            </div>
        </div>
    )
}
