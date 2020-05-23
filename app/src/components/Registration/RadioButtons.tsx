import * as React from 'react'
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@material-ui/core'

interface Props {
    id: string
    name: string
    value: string
    onChange: (event: object) => void
    ariaLabel: string
    formLabel: string
    options: Array<string>
}

const RadioButtons = (props: Props) => {
    const { id, name, value, onChange, ariaLabel, formLabel, options } = props

    return (
        <>
            <form>
                <FormControl component="fieldset">
                    <FormLabel component="legend">{formLabel}</FormLabel>
                    <RadioGroup
                        id={id}
                        aria-label={ariaLabel}
                        name={name}
                        value={value}
                        onChange={onChange}
                    >
                        {options.map((buttonLabel: string) => {
                            return (
                                <FormControlLabel
                                    value={buttonLabel}
                                    control={<Radio />}
                                    label={buttonLabel}
                                />
                            )
                        })}
                    </RadioGroup>
                </FormControl>
            </form>
        </>
    )
}

export default RadioButtons
