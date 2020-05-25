import React from 'react'
import Checkbox from './Checkbox'
import Dropdown from './Dropdown'
import RadioButtons from './RadioButtons'
import TextInput from './TextInput'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from 'styled-components'

const theme = createMuiTheme()

const AllInputs = (props: any) => {
    //checkbox
    const [checked, setChecked] = React.useState({
        yes: false,
        no: false,
    })
    const handleCheck = (event: any) => {
        setChecked({ ...checked, [event.target.name]: event.target.checked })
    }

    //input, radio, dropdown, text
    const [value, setValue] = React.useState('')

    //dropdown
    const [age, setAge] = React.useState('')

    const handleChange = (event: any) => {
        setValue(event.target.value)
    }

    return (
        //theme provider can wrap in questions component
        <ThemeProvider theme={theme}>
            <div style={{ padding: '5em' }}>
                <div
                    style={{
                        border: `1px solid black`,
                        margin: `1em`,
                        padding: `1em`,
                    }}
                >
                    <Checkbox
                        id={'1'}
                        options={['yes', 'no']}
                        label={`check me`}
                        helperText={`checked input`}
                        onChange={(event) => {
                            handleCheck(event)
                        }}
                    ></Checkbox>
                </div>
                <div
                    style={{
                        border: `1px solid black`,
                        margin: `1em`,
                        padding: `1em`,
                    }}
                >
                    <Dropdown
                        id={'1'}
                        options={['10', '20']}
                        name={`20`}
                        value={value}
                        itemValue={`20`}
                        htmlFor={`test`}
                        helperText={`dropdown`}
                        onChange={(event) => {
                            handleChange(event)
                        }}
                    ></Dropdown>
                </div>

                <div
                    style={{
                        border: `1px solid black`,
                        margin: `1em`,
                        padding: `1em`,
                    }}
                >
                    <RadioButtons
                        id={'1'}
                        options={['yes', 'no']}
                        name={`test`}
                        value={`yes`}
                        ariaLabel={`test`}
                        formLabel={`test`}
                        onChange={(event) => {
                            handleChange(event)
                        }}
                    ></RadioButtons>
                </div>

                <div
                    style={{
                        border: `1px solid black`,
                        margin: `1em`,
                        padding: `1em`,
                    }}
                >
                    <TextInput
                        id={'1'}
                        label={`text-field`}
                        name={`test`}
                        type={`text`}
                        value={`test`}
                        placeholder={`test`}
                        onChange={(event) => {
                            handleChange(event)
                        }}
                    ></TextInput>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default AllInputs
