/** MUI serves an 'elevation prop' warning; does not impact build/compile  **/

import * as React from 'react'
import {
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
    Select,
} from '@material-ui/core'
import { styles } from './styles'
import { withStyles, WithStyles } from '@material-ui/core'

interface Props extends WithStyles<typeof styles> {
    value: string
    onChange: (event: object) => void
    id: string
    options: Array<string>
    label: string
    labelId: string
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
