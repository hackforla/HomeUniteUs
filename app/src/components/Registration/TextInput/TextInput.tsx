import * as React from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles, WithStyles } from '@material-ui/core/'
import { styles } from './styles'

interface Props extends WithStyles<typeof styles> {
    name: string
    value?: string
    label?: string
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
    placeholder?: string
    type?: string
    autocomplete?: string
}
const TextInput = (props: Props) => {
    const {
        name,
        value,
        label,
        onChange,
        placeholder,
        type,
        autocomplete,
    } = props

    return (
        <>
            <TextField
                name={name}
                // value={value}
                label={label}
                // onChange={onChange}
                placeholder={placeholder}
                type={type}
                variant={'outlined'}
                autoComplete={autocomplete}
            ></TextField>
        </>
    )
}

export default withStyles(styles)(TextInput)
