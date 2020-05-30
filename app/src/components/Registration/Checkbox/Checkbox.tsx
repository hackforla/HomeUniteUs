import * as React from 'react'
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

interface classes {
    checkbox: string
}

interface Props {
    onChange: (event: object) => void
    label: string
    options: Array<string>
    helperText: string
    classes: classes
}

//checkbox for multi-select
const CheckboxInput = (props: Props) => {
    const { onChange, label, options, helperText, classes } = props
    let checked: boolean

    return (
        <>
            <FormControl className={classes.checkbox} component="fieldset">
                <FormLabel component="legend">{label}</FormLabel>
                <FormGroup>
                    {options.map((checkLabel: string) => {
                        return (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={onChange}
                                        name={checkLabel}
                                        value={checkLabel}
                                    />
                                }
                                label={checkLabel}
                            />
                        )
                    })}
                </FormGroup>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </>
    )
}

export default withStyles(styles)(CheckboxInput)
