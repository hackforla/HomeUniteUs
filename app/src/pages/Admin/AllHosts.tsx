// NOTE: this is a somewhat contrived component to 
// propose a general approach to API integration and
// local state management
import * as React from 'react';
import { Fetcher } from '../../data/ApiWrapper';
import { Host } from '../../models';
import { MessageModal } from './TempModal';

// helper class to abstract out HTTP and API
//   implementation details
const hostsFetcher = new Fetcher<Host>('hosts');

// the complete model of the UI state for this 
//    component, and possibly its descendants
interface AllHostsState {
    hosts: Array<Host> | null,
    messageModalState: {
        open: boolean;
        message: string;
    },
    loaderState: {
        loading: boolean,
        text: string
    }
};

// syntactic sugar that lets us have the 
//   robustness of integer comparison over 
//   string matching
enum AllHostsActionType {
    DisplayMessage,
    AcknowledgeMessage,
    BeginFetchHosts,
    FinishFetchHosts
};

// objects of this type will be sent to reducer
//  to inform a state change
//  'type' will be used to select which block of state-changing code
//      pertains to this action
//   'payload' will be used to assign *values* in the state, 
//       e.g. the new data that just arrived, the error message to display, etc.
interface AllHostsAction {
    type: AllHostsActionType;
    payload?: string | Array<Host>;
};

// set reasonable defaults, make errors obvious (for dev)
const initialState: AllHostsState = {
    hosts: null,
    messageModalState: {
        open: false,
        message: 'Modal error'
    },
    loaderState: {
        loading: false,
        text: 'Loader error'
    }
};

// a large function with a simple task: tell me how this state should change
// based on this action
const reducer = (state: AllHostsState, action: AllHostsAction): AllHostsState => {

    switch (action.type) {

        case AllHostsActionType.DisplayMessage:
            return {
                ...state,
                messageModalState: {
                    ...state.messageModalState,
                    open: true,
                    message: action.payload as string
                },
                loaderState: {
                    ...state.loaderState,
                    loading: false
                }
            };

        case AllHostsActionType.AcknowledgeMessage:
            return {
                ...state,
                messageModalState: {
                    ...state.messageModalState,
                    open: false
                }
            };

        case AllHostsActionType.BeginFetchHosts:
            return {
                ...state,
                loaderState: {
                    ...state.loaderState,
                    loading: true,
                    text: action.payload as string
                }
            };

        case AllHostsActionType.FinishFetchHosts:
            return {
                ...state,
                loaderState: {
                    ...state.loaderState,
                    loading: false
                },
                hosts: action.payload as Array<Host>
            };

        default:
            throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
    }
};


export const AllHosts = () => {


    // 'state' contains all UI state, i.e. any dynamic values 
    //     we need to present the correct UI
    // 'dispatch' is used to change the state, it receives an 'action'
    //     and uses the properties of the action to return the next state.
    const [state, dispatch] = React.useReducer(reducer, initialState);

    // In this routine, we will use dispatch to:
    //     - show/hide the loader
    //     - display an error message modal, if necessary
    //     - load data into the state *after* it has been fetched
    const refreshHosts = async () => {

        try {

            // show the loader
            dispatch({
                type: AllHostsActionType.BeginFetchHosts
            });

            // long-running task runs in component, *not* the reducer
            const hosts = await hostsFetcher.getAll();

            // hide the loader, display the results
            dispatch({
                type: AllHostsActionType.FinishFetchHosts,
                payload: hosts
            });

        } catch (e) {

            // show the message modal with the exception text (dev. mode only)
            dispatch({
                type: AllHostsActionType.DisplayMessage,
                payload: `System error: ${e}`
            });

        }
    };

    // load the data automatically when component loads,
    //     driven by user events after that
    React.useEffect(() => {
        refreshHosts();
    }, []);


    return (
        <>

            {/* Modal for notifications and errors */}
            <MessageModal
                {...state.messageModalState}
                onAck={() => dispatch({ type: AllHostsActionType.AcknowledgeMessage })}
            />

            <div>
                <h1>All Hosts</h1>
                {
                    state.hosts
                        ? <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    state.hosts.map((host: Host) => {
                                        return (
                                            <tr>
                                                <td>{`${host.firstName} ${host.lastName}`}</td>
                                                <td>{host.address}</td>
                                                <td>{host.phone}</td>
                                            </tr>
                                        );
                                    })
                                }

                            </tbody>
                        </table>
                        : null
                }
                <button
                    onClick={() => dispatch({
                        type: AllHostsActionType.DisplayMessage,
                        payload: 'Hello user'
                    })}
                >
                    Refresh Hosts
                </button>
            </div>

        </>

    );

};