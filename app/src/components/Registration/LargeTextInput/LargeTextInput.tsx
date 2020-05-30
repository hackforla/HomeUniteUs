import * as React from 'react'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'
import { styles } from './styles'

interface Props {
    name: string
    value: string
    onChange: (event: object) => void
    placeholder: string
    type: string
    id: string
    rows: number
}

const LargeTextInput = (props: Props) => {
    const { name, value, onChange, placeholder, type, id, rows } = props

    return (
        <>
            <TextField
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                type={type}
                multiline
                rows={rows}
                variant={'outlined'}
            ></TextField>
        </>
    )
}

export default withStyles(styles)(LargeTextInput)
