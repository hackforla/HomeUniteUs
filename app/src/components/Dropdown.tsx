import * as React from 'react'
import {
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
    Select,
} from '@material-ui/core'

const DropdownSelect = (props: {
    name: string
    value: string
    onChange: (event: object) => void
    placeholder: string
    id: string
    itemValue: string
    classes: string
    htmlFor: string
    helperText: string
    options: Array<string>
}) => {
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
            <form className={classes}>
                <FormControl>
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
                            return (
                                <MenuItem value={itemValue}>
                                    {menuItem}
                                </MenuItem>
                            )
                        })}
                    </Select>
                    <FormHelperText>{helperText}}</FormHelperText>
                </FormControl>
            </form>
        </>
    )
}

export default DropdownSelect
