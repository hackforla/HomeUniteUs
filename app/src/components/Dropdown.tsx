import * as React from 'react'
import {
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
    Select,
} from '@material-ui/core'

const DropdownSelect = (props: any) => {
    const {
        name,
        value,
        onChange,
        placeholder,
        id,
        itemValue,
        classes,
        htmlFor,
        helperText,
        options,
    } = props

    return (
        <>
            <FormControl className={classes}>
                <InputLabel htmlFor={htmlFor}>{placeholder}</InputLabel>
                <Select
                    value={value}
                    onChange={onChange}
                    inputProps={{
                        name,
                        id,
                    }}
                >
                    {options.map((menuItem: string) => {
                        return <MenuItem value={itemValue}>{menuItem}</MenuItem>
                    })}
                </Select>
                <FormHelperText>{helperText}}</FormHelperText>
            </FormControl>
        </>
    )
}

export default DropdownSelect
