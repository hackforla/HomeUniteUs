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
}

const TextInput = (props: Props) => {
    const { name, value, onChange, placeholder, type, id, label } = props

    return (
        <>
            <form>
                <TextField
                    id={id}
                    label={label}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    type={type}
                    variant={'outlined'}
                ></TextField>
            </form>
        </>
    )
}

export default TextInput
