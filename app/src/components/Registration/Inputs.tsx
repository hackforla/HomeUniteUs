import React from 'react'
import Checkbox from './Checkbox'
import Dropdown from './Dropdown'
import RadioButtons from './RadioButtons'
import TextInput from './TextInput'

const AllInputs = (props) => {
    return (
        <>
            <Checkbox
                options={['yes', 'no']}
                label={`check me`}
                checked={false}
                helperText={`checked input`}
                onChange={(event) => {
                    console.log('check')
                }}
            ></Checkbox>
            <Dropdown></Dropdown>
            <RadioButtons></RadioButtons>
            <TextInput></TextInput>
        </>
    )
}

export default AllInputs
