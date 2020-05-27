import * as React from 'react'
import {
    InputLabel,
    MenuItem,
    FormHelperText,
    FormControl,
    Select,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(0),
        minWidth: 200,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}))

interface Props {
    value: string
    onChange: (event: object) => void
    id: string
    helperText: string
    options: Array<string>
    label: string
    labelId: string
}

const DropdownSelect = (props: Props) => {
    const classes = useStyles()
    const { value, onChange, id, helperText, options, label } = props

    return (
        <>
            <form>
                <FormControl
                    variant={`outlined`}
                    className={classes.formControl}
                >
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
                            return (
                                <MenuItem value={menuItem}>{menuItem}</MenuItem>
                            )
                        })}
                    </Select>
                    <FormHelperText>{helperText}</FormHelperText>
                </FormControl>
            </form>
        </>
    )
}

export default DropdownSelect
