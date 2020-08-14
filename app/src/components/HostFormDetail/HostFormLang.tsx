import React from 'react'
import {
    TextField,
    MenuItem,
    Container,
    Divider,
    InputLabel,
    Select,
} from '@material-ui/core'

function HostFormLang() {
    return (
        <div>
            <Container>
                <TextField select margin="normal">
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {/* {usStates?.states.map(state => (
                <MenuItem key={state.abbreviation} value={state.abbreviation}>
                    {state.name}
                </MenuItem>
            ))} */}
                </TextField>

                <Divider />

                <InputLabel id="handle">Handle</InputLabel>
                <Select
                    labelId="handle"
                    id="handle"
                    // value={handle}
                    // onChange={handleSelect}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value="Ten">Ten</MenuItem>
                    <MenuItem value="Twenty">Twenty</MenuItem>
                    <MenuItem value="Thirty">Thirty</MenuItem>
                </Select>
            </Container>
        </div>
    )
}

export default HostFormLang
