/** KNOWN OPEN ISSUE VIA MUI: https://github.com/mui-org/material-ui/issues/20064 re: elevation   **/

import * as React from 'react'
import {
    InputLabel,
    MenuItem,
    FormHelperText, //imported but not in style guide
    FormControl,
    Select,
} from '@material-ui/core'
import { styles } from './styles'
import { withStyles } from '@material-ui/core/styles'

interface Classes {
    formControl: string
}

interface Props {
    value: string
    onChange: (event: object) => void
    id: string
    options: Array<string>
    label: string
    labelId: string
    classes: Classes
}

const DropdownSelect = (props: Props) => {
    //drop down select 'options' can be an array of objects to store and id to pass to value and a menu label
    const { classes, value, onChange, id, options, label } = props

    return (
        <>
            <FormControl variant={`outlined`} className={classes.formControl}>
                <InputLabel id={id}>{label}</InputLabel>
                <Select
                    labelId={id}
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
            </FormControl>
        </>
    )
}

export default withStyles(styles)(DropdownSelect)
