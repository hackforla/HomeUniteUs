import * as React from 'react'
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
} from '@material-ui/core'

const CheckboxInput = (props: {
    onChange: (event: object) => void
    className: string
    label: string
    options: Array<string>
    checked: boolean
}) => {
    const { onChange, className, label, options, checked } = props

    return (
        <>
            <form className={className}>
                <FormControl component="fieldset">
                    <FormLabel component="legend">
                        Assign responsibility
                    </FormLabel>
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
            </form>
        </>
    )
}

export default CheckboxInput
