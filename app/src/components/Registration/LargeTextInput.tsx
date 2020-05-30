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
    rows: number
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
        rows,
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
                multiline
                rows={rows}
            ></TextField>
        </>
    )
}

export default LargeTextInput
