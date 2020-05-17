import * as React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

const RadioButtons = (props: any) => {
    const {
        name,
        value,
        onChange,
        label,
        ariaLabel,
        formLabel,
        options,
    } = props
    //props to give input
    return (
        <>
            <FormControl component="fieldset">
                <FormLabel component="legend">{formLabel}</FormLabel>
                <RadioGroup
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
        </>
    )
}

export default RadioButtons
