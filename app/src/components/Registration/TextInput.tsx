import * as React from 'react'
import TextField from '@material-ui/core/TextField'

interface Props {
    name: string
    value: string
    onChange: (event: object) => void
    placeholder: string
    type: string
    id: string
    label: string
    helperText: string
}

const TextInput = (props: Props) => {
    const {
        name,
        value,
        onChange,
        placeholder,
        type,
        id,
        label,
        helperText,
    } = props

    return (
        <>
            <TextField
                id={id}
                label={label}
                name={name}
                value={value}
                onChange={onChange}
                helperText={helperText}
                placeholder={placeholder}
                type={type}
                variant={'outlined'}
            ></TextField>
        </>
    )
}

export default TextInput
