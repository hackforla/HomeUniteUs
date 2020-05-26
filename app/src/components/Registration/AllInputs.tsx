/*** sandbox component to view component lib : check out at route localhost:8080/componentlibrary ***/

import React from 'react'
import {
    Checkbox,
    Dropdown,
    RadioButtons,
    LargeTextInput,
    TextInput,
} from './index'
import { createMuiTheme } from '@material-ui/core/styles'
import { ThemeProvider } from 'styled-components'

const theme = createMuiTheme() // default mui theme assigned to Styled Component's theme provider

const AllInputs = () => {
    //mocking options key in Questions interface
    const options = {
        check: ['yes', 'no'],
        drop: ['10', '20'],
        radio: ['yes', 'no'],
    }

    //checkbox -> should only be used for multi-selecton
    const [checked, setChecked] = React.useState({
        yes: false,
        no: false,
    })
    const handleCheck = (event: any) => {
        setChecked({ ...checked, [event.target.name]: event.target.checked })
    }

    //input, radio, dropdown, text
    const [value, setValue] = React.useState('')
    const [text, setText] = React.useState('')

    //radio + dropdown
    const handleChange = (event: any) => {
        setValue(event.target.value)
    }

    //text inputs
    const handleText = (event: any) => {
        setText(event.target.value)
    }

    return (
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
                        options={options.check}
                        label={`checkbox`}
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
                        id={`demo-simple-select-outlined-label`}
                        labelId={`demo-simple-select-outlined-label`}
                        label={`Age`}
                        placeholder={'hi'}
                        options={options.drop}
                        value={value}
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
                        options={options.radio}
                        name={`test`}
                        value={value}
                        ariaLabel={`test`}
                        formLabel={`radio buttons`}
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
                        label={`small-form`}
                        name={`test`}
                        type={`text`}
                        value={text}
                        placeholder={`test`}
                        helperText={`Some important text`}
                        onChange={(event) => {
                            handleText(event)
                        }}
                    ></TextInput>
                </div>
                <div
                    style={{
                        border: `1px solid black`,
                        margin: `1em`,
                        padding: `1em`,
                    }}
                >
                    <LargeTextInput
                        id={'1'}
                        label={`large-form`}
                        name={`test`}
                        type={`text`}
                        value={text}
                        placeholder={`test`}
                        helperText={`Some important text`}
                        onChange={(event) => {
                            handleText(event)
                        }}
                    ></LargeTextInput>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default AllInputs
