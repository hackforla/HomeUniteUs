import * as React from 'react'
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

interface Props {
    name: string
    value: string
    label?: string
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    ariaLabel: string
    options: Array<any>
}

//radiobuttons for single option answers
const RadioButtons = (props: Props) => {
    const { name, value, onChange, ariaLabel, label, options } = props

    return (
        <>
            <FormControl component="fieldset">
                <FormLabel component="legend">{label}</FormLabel>
                <RadioGroup
                    aria-label={ariaLabel}
                    name={name}
                    value={value}
                    onChange={onChange}
                >
                    {options.map((option: any) => {
                        return (
                            <FormControlLabel
                                key={option.value}
                                label={option.label}
                                control={<Radio />}
                                value={option.value}
                            />
                        )
                    })}
                </RadioGroup>
            </FormControl>
        </>
    )
}

export default withStyles(styles)(RadioButtons)
