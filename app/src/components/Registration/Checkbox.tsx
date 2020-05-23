import * as React from 'react'
import {
    FormLabel,
    FormControl,
    FormGroup,
    FormControlLabel,
    FormHelperText,
    Checkbox,
} from '@material-ui/core'

interface Props {
    id: string
    onChange: (event: object) => void
    label: string
    options: Array<string>
    checked: boolean
    helperText: string
    value: string
}

const CheckboxInput = (props: Props) => {
    const { onChange, label, options, checked, helperText, value } = props

    return (
        <>
            <form>
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
                                            value={value}
                                        />
                                    }
                                    label={checkLabel}
                                />
                            )
                        })}
                    </FormGroup>
                    <FormHelperText>{helperText}</FormHelperText>
                </FormControl>
            </form>
        </>
    )
}

export default CheckboxInput
