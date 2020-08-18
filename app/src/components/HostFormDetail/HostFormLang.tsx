import React from 'react'
import useAutocomplete from '@material-ui/lab/useAutocomplete'
import NoSsr from '@material-ui/core/NoSsr'
import CheckIcon from '@material-ui/icons/Check'
import CloseIcon from '@material-ui/icons/Close'
import styled from 'styled-components'
import { Typography, Container } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

const Label = styled('label')`
    padding: 0 0 4px;
    line-height: 1.5;
    display: block;
`

const InputWrapper = styled('div')`
    width: 440px;
    border: 1px solid black;
    background-color: #fff;
    border-radius: 4px;
    padding: 0.5rem;
    display: flex;
    flex-wrap: wrap;

    &:hover {
        border-color: #40a9ff;
    }

    &.focused {
        border-color: #40a9ff;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    & input {
        font-size: 20px;
        height: 30px;
        box-sizing: border-box;
        padding: 4px 6px;
        width: 0;
        min-width: 30px;
        flex-grow: 1;
        border: 0;
        margin: 0;
        outline: 0;
    }
`

const Tag = styled(({ label, onDelete, ...props }) => (
    <div
        {...props}
        style={{ background: '#55B1EB', color: 'white', borderRadius: '4px' }}
    >
        <span>{label}</span>
        <CloseIcon onClick={onDelete} />
    </div>
))`
    display: flex;
    align-items: center;
    height: 24px;
    margin: 2px;
    line-height: 22px;
    background-color: #fafafa;
    border: 1px solid #e8e8e8;
    border-radius: 2px;
    box-sizing: content-box;
    padding: 0 4px 0 10px;
    outline: 0;
    overflow: hidden;

    &:focus {
        border-color: #40a9ff;
        background-color: #e6f7ff;
    }

    & span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    & svg {
        font-size: 12px;
        cursor: pointer;
        padding: 4px;
    }
`

const Listbox = styled('ul')`
    width: 440px;
    margin: 2px 0 0;
    padding: 1rem;
    position: absolute;
    list-style: none;
    background-color: #fff;
    overflow: auto;
    max-height: 250px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 1;

    ::-webkit-scrollbar {
        scrollbar-width: thin;
    }

    & li {
        padding: 5px 12px;
        display: flex;

        & span {
            flex-grow: 1;
        }

        & svg {
            color: transparent;
        }
    }

    & li[aria-selected='true'] {
        background-color: #e6e6e6;
        font-weight: 600;

        & svg {
            color: #1890ff;
        }
    }

    & li[data-focus='true'] {
        background-color: #e6f7ff;
        cursor: pointer;

        & svg {
            color: #000;
        }
    }
`

function HostFormLang() {
    const {
        getRootProps,
        getInputLabelProps,
        getInputProps,
        getTagProps,
        getListboxProps,
        getOptionProps,
        groupedOptions,
        value,
        focused,
        setAnchorEl,
    } = useAutocomplete({
        id: 'customized-hook-demo',
        defaultValue: [languages[0]],
        multiple: true,
        options: languages,
        getOptionLabel: (option) => option.language,
    })

    return (
        <Container maxWidth="md">
            <NoSsr>
                <div>
                    <div {...getRootProps()}>
                        <Typography variant="h5" {...getInputLabelProps()}>
                            What Language(s) do you Speak at Home?
                        </Typography>
                        <label
                            style={{ color: 'grey', marginBottom: '0.5rem' }}
                        >
                            Select Additional Language(s)
                        </label>
                        <br />
                        <InputWrapper
                            ref={setAnchorEl}
                            className={focused ? 'focused' : ''}
                        >
                            {value.map(
                                (option: LanguageType, index: number) => (
                                    <Tag
                                        label={option.language}
                                        {...getTagProps({ index })}
                                    />
                                )
                            )}
                            <input {...getInputProps()} />
                        </InputWrapper>
                        <br />
                        <InputWrapper
                            ref={setAnchorEl}
                            className={focused ? 'focused' : ''}
                        >
                            <SearchIcon />
                            <input {...getInputProps()} />
                        </InputWrapper>
                    </div>
                    {groupedOptions.length > 0 ? (
                        <Listbox {...getListboxProps()}>
                            {groupedOptions.map((option, index) => (
                                <li {...getOptionProps({ option, index })}>
                                    <span>{option.language}</span>
                                    <CheckIcon fontSize="small" />
                                </li>
                            ))}
                        </Listbox>
                    ) : null}
                </div>
            </NoSsr>
        </Container>
    )
}

export default HostFormLang

interface LanguageType {
    language: string
}

const languages = [
    { language: 'English' },
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
    { language: 'Latin' },
    { language: 'Latvian' },
    { language: 'Lithuanian' },
    { language: 'Macedonian' },
    { language: 'Malay' },
    { language: 'Malayalam' },
    { language: 'Maltese' },
    { language: 'Maori' },
    { language: 'Marathi' },
    { language: 'Mongolian' },
    { language: 'Nepali' },
    { language: 'Norwegian' },
    { language: 'Persian' },
    { language: 'Polish' },
    { language: 'Portuguese' },
    { language: 'Punjabi' },
    { language: 'Quechua' },
    { language: 'Romanian' },
    { language: 'Russian' },
    { language: 'Samoan' },
    { language: 'Serbian' },
    { language: 'Slovak' },
    { language: 'Slovenian' },
    { language: 'Spanish' },
    { language: 'Swahili' },
    { language: 'Swedish' },
    { language: 'Tamil' },
    { language: 'Tatar' },
    { language: 'Telugu' },
    { language: 'Thai' },
    { language: 'Tibetan' },
    { language: 'Tonga' },
    { language: 'Turkish' },
    { language: 'Ukrainian' },
    { language: 'Urdu' },
    { language: 'Uzbek' },
    { language: 'Vietnamese' },
    { language: 'Welsh' },
    { language: 'Xhosa' },
]
