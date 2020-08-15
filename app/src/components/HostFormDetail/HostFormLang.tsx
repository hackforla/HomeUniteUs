import React from 'react'
import {
    TextField,
    MenuItem,
    Container,
    Divider,
    InputLabel,
    Select,
    Checkbox,
    Typography,
} from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

function HostFormLang() {
    return (
        <div>
            <Container maxWidth="md">
                <Typography variant="h5">
                    What Languages do you speak in the Home?
                </Typography>
                <br />
                <Autocomplete
                    multiple
                    options={languages}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.language}
                    renderOption={(option, { selected }) => (
                        <>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            {option.language}
                        </>
                    )}
                    style={{ width: 500 }}
                    renderInput={(params) => (
                        <>
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Select Language(s)"
                            />
                        </>
                    )}
                />
            </Container>
        </div>
    )
}

export default HostFormLang

const languages = [
    { language: 'Afrikaans' },
    { language: 'Albanian' },
    { language: 'Arabic' },
    { language: 'Armenian' },
    { language: 'Basque' },
    { language: 'Bengali' },
    { language: 'Bulgarian' },
    { language: 'Catalan' },
    { language: 'Cambodian' },
    { language: 'Chinese (Mandarin)' },
    { language: 'Croatian' },
    { language: 'Czech' },
    { language: 'Danish' },
    { language: 'Dutch' },
    { language: 'English' },
    { language: 'Estonian' },
    { language: 'Fiji' },
    { language: 'Finnish' },
    { language: 'French' },
    { language: 'Georgian' },
    { language: 'German' },
    { language: 'Greek' },
    { language: 'Gujarati' },
    { language: 'Hebrew' },
    { language: 'Hindi' },
    { language: 'Hungarian' },
    { language: 'Icelandic' },
    { language: 'Indonesian' },
    { language: 'Irish' },
    { language: 'Italian' },
    { language: 'Japanese' },
    { language: 'Javanese' },
    { language: 'Korean' },
]

{
    /* <select data-placeholder="Choose a Language...">
  Afrikaans
  Albanian
  Arabic
  Armenian
  Basque
  Bengali
  Bulgarian
  Catalan
  Cambodian
  Chinese (Mandarin)
  Croatian
  Czech
  Danish
  Dutch
  English
  Estonian
  Fiji
  Finnish
  French
  Georgian
  German
  Greek
  Gujarati
  Hebrew
  Hindi
  Hungarian
  Icelandic
  Indonesian
  Irish
  Italian
  Japanese
  Javanese
  Korean //i stopped here
  < value="LA">Latin</>
  < value="LV">Latvian</>
  < value="LT">Lithuanian</>
  < value="MK">Macedonian</>
  < value="MS">Malay</>
  < value="ML">Malayalam</>
  < value="MT">Maltese</>
  < value="MI">Maori</>
  < value="MR">Marathi</>
  < value="MN">Mongolian</>
  < value="NE">Nepali</>
  < value="NO">Norwegian</>
  < value="FA">Persian</>
  < value="PL">Polish</>
  < value="PT">Portuguese</>
  < value="PA">Punjabi</>
  < value="QU">Quechua</>
  < value="RO">Romanian</>
  < value="RU">Russian</>
  < value="SM">Samoan</>
  < value="SR">Serbian</>
  < value="SK">Slovak</>
  < value="SL">Slovenian</>
  < value="ES">Spanish</>
  < value="SW">Swahili</>
  < value="SV">Swedish </>
  < value="TA">Tamil</>
  < value="TT">Tatar</>
  < value="TE">Telugu</>
  < value="TH">Thai</>
  < value="BO">Tibetan</>
  < value="TO">Tonga</>
  < value="TR">Turkish</>
  < value="UK">Ukrainian</>
  < value="UR">Urdu</>
  < value="UZ">Uzbek</>
  < value="VI">Vietnamese</>
  < value="CY">Welsh</>
  < value="XH">Xhosa</>
</select> */
}
