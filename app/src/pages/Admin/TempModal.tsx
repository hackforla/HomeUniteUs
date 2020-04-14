import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { useHistory, useParams } from "react-router";

const modalRoot = document.getElementById('modal-root')!;

// https://reactjs.org/docs/portals.html
class ModalContainer extends React.Component {

    public el: HTMLDivElement;

    constructor(props: any) {
        super(props);
        this.el = document.createElement('div');
    }

    componentDidMount() {
        modalRoot.appendChild(this.el);
    }

    componentWillUnmount() {
        modalRoot.removeChild(this.el);
    }

    render() {
        return ReactDOM.createPortal(
            this.props.children,
            this.el
        );
    }
}

export interface TempModalProps {
    open: boolean;
};

// https://reacttraining.com/react-router/web/example/modal-gallery
export const TempModal = (props: React.PropsWithChildren<TempModalProps>) => {
    return (
        <ModalContainer>
            {
                props.open
                    ?
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            background: "rgba(0, 0, 0, 0.15)"
                        }}
                    >
                        <div
                            className="modal"
                            style={{
                                position: "absolute",
                                background: "#fff",
                                top: 25,
                                left: "10%",
                                right: "10%",
                                padding: 15,
                                border: "2px solid #444"
                            }}
                        >
                            {props.children}
                        </div>
                    </div>


                    : null
            }
        </ModalContainer>
    );
};

export interface MessageModalProps {
    message: string;
    open: boolean;
    onAck: () => void;
};

export const MessageModal = (props: MessageModalProps) => {
    return <TempModal open={props.open}>
        <div>
            <h4>{props.message}</h4>
            <button onClick={props.onAck}>OK</button>
        </div>
    </TempModal>
};

export interface LoaderModalProps {
    text: string;
    loading: boolean;
};

export const LoaderModal = (props: MessageModalProps) => {
    return <TempModal open={props.open}>
        <div>
            <h4>{props.message}</h4>
            <button onClick={props.onAck}>OK</button>
        </div>
    </TempModal>
};