import * as React from 'react'
import {
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
    Select,
} from '@material-ui/core'
import { styles } from './styles'
import { withStyles } from '@material-ui/core/styles'

interface Props {
    value: string
    onChange: (event: object) => void
    id: string
    helperText: string
    options: Array<string>
    label: string
    labelId: string
    labelWidth: number
    classes: any
}

const DropdownSelect = (props: Props) => {
    //drop down select 'options' can be an array of objects to store and id to pass to value and a menu label
    const {
        classes,
        value,
        onChange,
        id,
        helperText,
        options,
        label,
        labelWidth,
    } = props

    return (
        <>
            <FormControl variant={`outlined`} className={classes.formControl}>
                <InputLabel id={id}>{label}</InputLabel>
                <Select
                    labelId={id}
                    labelWidth={labelWidth}
                    value={value}
                    onChange={onChange}
                    inputProps={{
                        name,
                        id,
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {options.map((menuItem: string) => {
                        return <MenuItem value={menuItem}>{menuItem}</MenuItem>
                    })}
                </Select>
                <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
        </>
    )
}

export default withStyles(styles)(DropdownSelect)
