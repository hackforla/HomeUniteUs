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

const LargeTextInput = (props: Props) => {
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
                placeholder={placeholder}
                helperText={helperText}
                type={type}
                variant={'outlined'}
                multiline
                rows={4}
            ></TextField>
        </>
    )
}

export default LargeTextInput
