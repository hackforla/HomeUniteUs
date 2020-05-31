import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '../Button/Button'

interface Props {
    classes: {
        card: string
    }
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
