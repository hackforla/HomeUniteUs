import * as React from 'react'
import { Input } from '@material-ui/core'

const TextInput = (props: any) => {
    const { name, value, onChange, placeholder, type } = props
    //props to give input
    return (
        <Input
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            type={type}
        ></Input>
    )
}

export default TextInput
