import React, { useState, useEffect, useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import {
    Container,
    Card,
    Image,
    Btn,
    CardHover,
    BtnContainer,
    CardHover2,
    Text,
    InnerCard,
    Header,
} from './style'
import { ModuleLogger, LogLevel } from '../../utils/Logger'
import { useAuth0, Auth0User } from '../../react-auth0-spa'

enum ProfileType {
    Host,
    Guest,
    None,
}

interface ProfileSelectionState {
    profileType: ProfileType
}

enum ProfileSelectionActionType {
    SelectProfileType,
}

interface ProfileSelectionAction {
    type: ProfileSelectionActionType
    payload: ProfileType
}

const reducer = (
    state: ProfileSelectionState,
    action: ProfileSelectionAction
): ProfileSelectionState => {
    switch (action.type) {
        case ProfileSelectionActionType.SelectProfileType:
            return {
                ...state,
                profileType: action.payload as ProfileType,
            }
        default:
            throw new Error(`Invalid action: ${JSON.stringify(action)}`)
    }
}

const initialState: ProfileSelectionState = {
    profileType: ProfileType.None,
}

function ProfileSelection() {
    const history = useHistory()
    // const [host, setHost] = useState(false)
    // const [guest, setGuest] = useState(false)

    const { user } = useAuth0()

    const [state, dispatch] = useReducer(reducer, initialState)

    const logger = new ModuleLogger('ProfileSelection', LogLevel.Debug)

    // const handleToggle = (e: any): void => {
    //     if (e.target.alt === 'host') {
    //         setHost(!host)
    //         setGuest(false)
    //     }
    //     if (e.target.alt === 'guest') {
    //         setGuest(!guest)
    //         setHost(false)
    //     }
    // }

    const selectHost = () => {
        dispatch({
            type: ProfileSelectionActionType.SelectProfileType,
            payload: ProfileType.Host,
        })
    }
    const selectGuest = () => {
        dispatch({
            type: ProfileSelectionActionType.SelectProfileType,
            payload: ProfileType.Guest,
        })
    }

    const submit = async () => {
        if (state.profileType === ProfileType.None) {
            throw new Error(
                `No profile type selected. This should be disabled.`
            )
        }
        const profileType =
            state.profileType === ProfileType.Guest ? 'guest' : 'host'

        try {
            const response = await fetch(`/api/${profileType}/registration`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: (user as Auth0User).email,
                }),
            })

            if (response.status !== 200) {
                throw new Error(response.statusText)
            }

            history.push(`/${profileType}/dashboard`)
        } catch (e) {
            console.log(`Error registering host: ${e}`)
        }
    }

    // const handleClick = (e: any) => {
    //     logger.debug('hitting')
    // }

    useEffect(() => {
        logger.debug('mounted')
    }, [])

    return (
        <Container>
            <Header>
                <h1>Select a Profile</h1>
            </Header>

            <Card>
                <InnerCard>
                    {state.profileType === ProfileType.Host ? (
                        <CardHover2 onClick={selectHost}>
                            <Image
                                src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png"
                                alt="host"
                            />
                        </CardHover2>
                    ) : (
                        <CardHover onClick={selectHost}>
                            <Image
                                src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png"
                                alt="host"
                            />
                        </CardHover>
                    )}

                    {state.profileType === ProfileType.Guest ? (
                        <CardHover2 onClick={selectGuest}>
                            <Image
                                src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png"
                                alt="guest"
                            />
                        </CardHover2>
                    ) : (
                        <CardHover onClick={selectGuest}>
                            <Image
                                src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png"
                                alt="guest"
                            />
                        </CardHover>
                    )}
                    {/* {host && guest === false ? (
                        <CardHover2 onClick={(e: any) => handleToggle(e)}>
                            <Image
                                src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png"
                                alt="host"
                            />
                        </CardHover2>
                    ) : (
                        <CardHover onClick={(e: any) => handleToggle(e)}>
                            <Image
                                src="https://www.shareicon.net/data/256x256/2016/05/25/770519_home_512x512.png"
                                alt="host"
                            />
                        </CardHover>
                    )}

                    {guest && host === false ? (
                        <CardHover2 onClick={(e: any) => handleToggle(e)}>
                            <Image
                                src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png"
                                alt="guest"
                            />
                        </CardHover2>
                    ) : (
                        <CardHover onClick={(e: any) => handleToggle(e)}>
                            <Image
                                src="https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/2062002861579680337-256.png"
                                alt="guest"
                            />
                        </CardHover>
                    )} */}
                </InnerCard>
                <Text>
                    <p>Host</p>
                    <p>Guest</p>
                </Text>
                <BtnContainer>
                    {state.profileType === ProfileType.None ? (
                        <Btn disabled>Select one...</Btn>
                    ) : (
                        <Btn onClick={submit}>Next...</Btn>
                    )}
                </BtnContainer>
            </Card>
        </Container>
    )
}

export default ProfileSelection
