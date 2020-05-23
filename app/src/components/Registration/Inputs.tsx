import React from 'react'
import Checkbox from './Checkbox'
import Dropdown from './Dropdown'
import RadioButtons from './RadioButtons'
import TextInput from './TextInput'

const AllInputs = (props) => {
    return (
        <>
            <Checkbox
                id={'1'}
                options={['yes', 'no']}
                label={`check me`}
                checked={false}
                helperText={`checked input`}
                onChange={(event) => {
                    console.log('check')
                }}
            ></Checkbox>
            <Dropdown
                id={'1'}
                options={['yes', 'no']}
                name={`test`}
                value={`test`}
                placeholder={`test`}
                itemValue={`test`}
                htmlFor={`test`}
                helperText={`dropdown input`}
                onChange={(event) => {
                    console.log('drop')
                }}
            ></Dropdown>
            <RadioButtons
                id={'1'}
                options={['yes', 'no']}
                name={`test`}
                value={`test`}
                ariaLabel={`test`}
                formLabel={`test`}
                onChange={(event) => {
                    console.log('radio')
                }}
            ></RadioButtons>
            <TextInput
                id={'1'}
                label={`check me`}
                name={`test`}
                type={`text`}
                value={`test`}
                placeholder={`test`}
                onChange={(event) => {
                    console.log('text')
                }}
            ></TextInput>
        </>
    )
}

export default AllInputs
