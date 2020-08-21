import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { useHistory, useParams } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { Host } from '../../models'

const modalRoot = document.getElementById('modal-root')!

// https://reactjs.org/docs/portals.html
class ModalContainer extends React.Component {
    public el: HTMLDivElement

    constructor(props: any) {
        super(props)
        this.el = document.createElement('div')
    }

    componentDidMount() {
        modalRoot.appendChild(this.el)
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el)
    }

    render() {
        return ReactDOM.createPortal(this.props.children, this.el)
    }
}

export interface TempModalProps {
    open: boolean
}

// https://reacttraining.com/react-router/web/example/modal-gallery
export const TempModal = (props: React.PropsWithChildren<TempModalProps>) => {
    return (
        <ModalContainer>
            {props.open ? (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        background: 'rgba(0, 0, 0, 0.15)',
                    }}
                >
                    <div
                        className="modal"
                        style={{
                            position: 'absolute',
                            background: '#fff',
                            top: 25,
                            left: '10%',
                            right: '10%',
                            padding: 15,
                            border: '2px solid #444',
                        }}
                    >
                        {props.children}
                    </div>
                </div>
            ) : null}
        </ModalContainer>
    )
}

export interface MessageModalProps {
    message: string
    open: boolean
    onAck: () => void
}

export const MessageModal = (props: MessageModalProps) => {
    return (
        <TempModal open={props.open}>
            <div>
                <h4>{props.message}</h4>
                <button onClick={props.onAck}>OK</button>
            </div>
        </TempModal>
    )
}

export interface LoaderModalProps {
    text: string
    loading: boolean
}

export const LoaderModal = (props: LoaderModalProps) => {
    return (
        <TempModal open={props.loading}>
            <div>
                <h4>{props.text}</h4>
                <FontAwesomeIcon icon={faSpinner} spin />
            </div>
        </TempModal>
    )
}

interface HostEditorModalProps {
    open: boolean
    host: Host | null
    onComplete: (host: Host) => void
    onCancel: () => void
}

export const HostEditorModal = (props: HostEditorModalProps) => {
    const [host, setHost] = React.useState({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        petsText: '',
        dateOfBirth: new Date(),
        smokingText: '',
        substancesText: '',
        email: '',
        employmentCompany: '',
        employmentInfo: '',
        employmentPosition: '',
        durationOfStay: '',
        preferredCharacteristics: '',
        hostIntro: '',
        hostingAmount: 0,
        hostingChallenges: '',
        hostingStrengths: '',
        hostingInterest: '',
        housingType: '',
    } as Host)

    React.useEffect(() => {
        if (props.host) {
            setHost({ ...props.host })
        }
    }, [props.host])

    return (
        <TempModal open={props.open}>
            <div>
                <form>
                    <div>
                        <label>First Name: </label>
                        <input
                            value={host.firstName}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setHost({
                                    ...host,
                                    firstName: event.target.value,
                                })
                            }}
                        />
                    </div>
                    <div>
                        <label>Last Name: </label>
                        <input
                            value={host.lastName}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setHost({
                                    ...host,
                                    lastName: event.target.value,
                                })
                            }}
                        />
                    </div>
                    <div>
                        <label>Address: </label>
                        <input
                            value={host.address}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setHost({
                                    ...host,
                                    address: event.target.value,
                                })
                            }}
                        />
                    </div>
                    <div>
                        <label>Phone: </label>
                        <input
                            value={host.phone}
                            onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                                setHost({
                                    ...host,
                                    phone: event.target.value,
                                })
                            }}
                        />
                    </div>
                </form>
                <div>
                    <button
                        onClick={() => {
                            props.onComplete({ ...host })
                        }}
                    >
                        Update
                    </button>
                    <button
                        onClick={() => {
                            props.onCancel()
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </TempModal>
    )
}
