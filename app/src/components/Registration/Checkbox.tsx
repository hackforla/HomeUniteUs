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
    onChange: (event: object) => void
    label: string
    options: Array<string>
    helperText: string
}

//checkbox for multi-select
const CheckboxInput = (props: Props) => {
    const { onChange, label, options, helperText } = props
    let checked: boolean

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
            </form>
        </>
    )
}

export default CheckboxInput
