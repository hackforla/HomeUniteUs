import * as React from 'react'
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/'
import { styles } from './styles'

interface Props extends WithStyles<typeof styles> {
    name: string
    value: string
    label?: string
    onChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        value?: string
    ) => void
    ariaLabel: string
    options: Array<{ id: string; label?: string; text?: string }>
}

//radiobuttons for single option answers
const RadioButtons = (props: Props) => {
    const { name, value, onChange, ariaLabel, label, options, classes } = props

    React.useEffect(() => {
        console.log(`RadioButtons: value changed to ${value}`)
    }, [value])

    return (
        <>
            <FormControl component="fieldset" className={classes.radio}>
                <FormLabel component="legend">{label}</FormLabel>
                <RadioGroup
                    aria-label={ariaLabel}
                    name={name}
                    value={value}
                    onChange={onChange}
                >
                    {options.map(
                        (option: {
                            id: string
                            label?: string
                            text?: string
                        }) => {
                            return (
                                <FormControlLabel
                                    key={option.id}
                                    label={option.label || option.text}
                                    control={<Radio />}
                                    value={option.id}
                                    checked={(() => {
                                        return (
                                            value.toString().trim() ===
                                            option.id.toString().trim()
                                        )
                                    })()}
                                />
                            )
                        }
                    )}
                </RadioGroup>
            </FormControl>
        </>
    )
}

export default withStyles(styles)(RadioButtons)
