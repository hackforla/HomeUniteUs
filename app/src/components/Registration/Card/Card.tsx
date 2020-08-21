import React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/'
import { styles } from './styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '../Button/Button'

interface Props extends WithStyles<typeof styles> {
    // add props excluding classes
}

//to use as container OR can use Styled-Components
export default withStyles(styles)(function SimplePaper(props: Props) {
    const { classes } = props
    return (
        <div>
            <Card className={classes.card} variant="outlined">
                <CardContent>
                    <h2>this is a card </h2>
                </CardContent>
                <CardActions>
                    <Button
                        name={'card'}
                        value={'card'}
                        id={'card'}
                        onClick={(event) => console.log(event)}
                        label={'card'}
                    ></Button>
                </CardActions>
            </Card>
        </div>
    )
})
