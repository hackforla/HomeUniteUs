import * as React from "react";
import { Guest, Host, GuestQuestion, HostQuestion, Restriction } from "../models";


// design was informed by:
//   https://kentcdodds.com/blog/application-state-management-with-react
//   https://www.typescriptlang.org/docs/handbook/react-&-webpack.html
//   https://kentcdodds.com/blog/how-to-use-react-context-effectively


const AppContext = React.createContext({});

interface HostHomeData {
    guests: Array<Guest>;
    hosts: Array<Host>;
    guestQuestions: Array<GuestQuestion>;
    hostQuestions: Array<HostQuestion>;
    restrictions: Array<Restriction>;
};

enum HostHomeActionType {
    AddGuest
};

interface HostHomeAction {
    type: HostHomeActionType;
    payload: Guest;
};

function hostHomeDataReducer(state: HostHomeData, action: HostHomeAction) {
    switch (action.type) {
        case HostHomeActionType.AddGuest:
            return {
                ...state,
                guests: [...state.guests, { id: 1, name: 'tyler' }]
            };
        default:
            throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
    }
};

const initialState: HostHomeData = {
    guests: new Array<Guest>(),
    hosts: new Array<Host>(),
    guestQuestions: new Array<GuestQuestion>(),
    hostQuestions: new Array<HostQuestion>(),
    restrictions: new Array<Restriction>()
};

export function HostHomeDataProvider(props: React.PropsWithChildren<{}>): JSX.Element {

    const [state, dispatch] = React.useReducer(hostHomeDataReducer, initialState);

    const value = React.useMemo(() => [state, dispatch], [state]);
    return <AppContext.Provider value={value} {...props} />;
};

export function useHostHomeData() {
    const context = React.useContext(AppContext);
    if (!context) {
        throw new Error('useHostHomeData must be used within a HostHomeDataProvider');
    }

    const [data, dispatch] = context as [
        HostHomeData,
        React.Dispatch<HostHomeAction>
    ];

    // All Create, Update, Delete operations
    const addGuest = (guest: Guest) => dispatch({ type: HostHomeActionType.AddGuest, payload: guest });
    // ...
    
    return {
        data,
        dispatch, // do we still want access to this?
        addGuest
    };
};