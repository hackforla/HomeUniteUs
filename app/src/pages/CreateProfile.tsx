import * as React from 'react'
import { useAuth0 } from '../react-auth0-spa'
import { useHistory } from 'react-router'

enum ProfileType {
    Guest = 'guest',
    Host = 'host',
    Administrator = 'administrator',
}

interface ProfileCreateResponse {
    _id: string
}
interface ProfileCreateSuccessPayload {
    type: ProfileType
    _id: string
}

interface CreateProfileState {
    loadingModal: {
        isOpen: boolean
        message: string
    }
    messageModal: {
        isOpen: boolean
        message: string
        onConfirm: () => void
    }
}

enum CreateProfileActionType {
    BeginTryCreateProfile,
    CompleteCreateProfile,
    RaiseError,
    DisplayMessage,
}

interface CreateProfileAction {
    type: CreateProfileActionType
    payload?: string | ProfileCreateResponse
}

const reducer = (
    state: CreateProfileState,
    action: CreateProfileAction
): CreateProfileState => {
    switch (action.type) {
        case CreateProfileActionType.BeginTryCreateProfile:
            return {
                ...state,
                loadingModal: {
                    ...state.loadingModal,
                    isOpen: true,
                    message: `Creating profile for user ...`,
                },
            }

        case CreateProfileActionType.CompleteCreateProfile:
            const payload = action.payload as ProfileCreateSuccessPayload
            return {
                ...state,
                loadingModal: {
                    ...state.loadingModal,
                    isOpen: false,
                },
                messageModal: {
                    ...state.messageModal,
                    isOpen: true,
                    message: `Profile created: ${JSON.stringify(payload)}`,
                },
            }

        case CreateProfileActionType.RaiseError:
            return {
                ...state,
                loadingModal: {
                    ...state.loadingModal,
                    isOpen: false,
                },
                messageModal: {
                    ...state.messageModal,
                    isOpen: true,
                    message: `Error: ${action.payload as string}`,
                },
            }

        default:
            throw new Error(`invalid action: ${JSON.stringify(action)}`)
    }
}

const initialState: CreateProfileState = {
    loadingModal: {
        isOpen: false,
        message: 'loading modal error',
    },
    messageModal: {
        isOpen: false,
        message: 'message modal error',
        onConfirm: () => {},
    },
}

export const CreateProfile = () => {
    
    const { user } = useAuth0()

    const [state, dispatch] = React.useReducer(reducer, initialState)

    const history = useHistory()

    const createProfile = async (type: ProfileType) => {
        dispatch({
            type: CreateProfileActionType.BeginTryCreateProfile,
        })
        try {
            const response = await fetch(`/api/profile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user?.sid,
                    type: type.toString(),
                }),
            })
            if (response.status !== 200) {
                throw new Error(response.statusText)
            }
            const data: ProfileCreateResponse = await response.json()
            dispatch({
                type: CreateProfileActionType.CompleteCreateProfile,
                payload: {
                    type,
                    _id: data._id,
                } as ProfileCreateSuccessPayload,
            })
            switch (type) {
                case ProfileType.Guest:
                    history.push({
                        pathname: '/profile/guest',
                    })
                    break
                case ProfileType.Administrator:
                    history.push({
                        pathname: '/admin/guests',
                    })
                    break
                case ProfileType.Host:
                    history.push({
                        pathname: '/profile/host',
                    })
                    break
            }
        } catch (e) {
            console.log(`error: ${JSON.stringify(e)}`)
            dispatch({
                type: CreateProfileActionType.RaiseError,
                payload: `${e}`,
            })
        }
    }

    return (
        <div>
            {state.loadingModal.isOpen ? (
                <div>{state.loadingModal.message}</div>
            ) : state.messageModal.isOpen ? (
                <div
                    style={{
                        backgroundColor: '#ff5e7b',
                        padding: '1rem 3rem',
                        border: '2rem solid black',
                        borderRadius: '1.4rem',
                    }}
                >
                    {state.messageModal.message}
                </div>
            ) : (
                <div
                    style={{
                        backgroundColor: '#FA114F',
                        color: 'white',
                        fontSize: '1.9rem',
                        padding: '1rem 3rem',
                        border: '2rem solid black',
                        borderRadius: '1.4rem',
                    }}
                >
                    <ul>
                        <li>
                            <a
                                onClick={() => {
                                    createProfile(ProfileType.Guest)
                                }}
                            >
                                Guest
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => {
                                    createProfile(ProfileType.Host)
                                }}
                            >
                                Host
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => {
                                    createProfile(ProfileType.Administrator)
                                }}
                            >
                                Administrator
                            </a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export const CreateGuestProfile = () => {
    return (
        <div>
            <h1>Create Guest Profile</h1>
        </div>
    )
}

export const CreateHostProfile = () => {
    return (
        <div>
            <h1>Create Host Profile</h1>
        </div>
    )
}
