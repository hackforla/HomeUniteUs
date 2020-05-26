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
    helperText: string
}) => {
    const { onChange, className, label, options, checked, helperText } = props

    return (
        <>
            <form className={className}>
                <FormControl component="fieldset">
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
                                        />
                                    }
                                    label={checkLabel}
                                />
                            )
                        })}
                        />
                    </FormGroup>
                    <FormHelperText>{helperText}</FormHelperText>
                </FormControl>
            </form>
        </>
    )
}

export default CheckboxInput
