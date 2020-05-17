import * as React from 'react'
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
} from '@material-ui/core'

const CheckboxInput = (props: any) => {
    const { name, onChange, classes, label, options, checked } = props

    return (
        <>
            <FormControl component="fieldset" className={classes}>
                <FormLabel component="legend">Assign responsibility</FormLabel>
                <FormGroup>
                    {options.map((checkLabel: string) => {
                        return (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={checked}
                                        onChange={onChange}
                                        name={checkLabel}
                                    />
                                }
                                label={label}
                            />
                        )
                    })}
                    />
                </FormGroup>
                <FormHelperText>Be careful</FormHelperText>
            </FormControl>
        </>
    )
}

export default CheckboxInput
