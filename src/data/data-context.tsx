import * as React from "react";
import { Guest, Host, GuestQuestion, HostQuestion, Restriction, MatchResult, GuestInterestLevel, ResponseMultiplicity } from "../models";
import { CommonResponseValues } from "../models/ResponseValue";


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
    matchResults: Array<MatchResult>;
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
    guests: [
        {
            name: 'John',
            id: 1
        },
        {
            name: 'Jane',
            id: 2
        },
        {
            name: 'Jim',
            id: 3
        }
    ],
    hosts: [
        {
            address: '123 Main Blvd.',
            id: 1
        },
        {
            address: '456 Broadway Ave.',
            id: 2
        },
        {
            address: '789 First St.',
            id: 3
        }
    ],
    guestQuestions: [
        {
            id: 1,
            questionKey: 'smoking',
            text: 'Do you smoke?',
            responseValues: [
                CommonResponseValues.Yes.id,
                CommonResponseValues.No.id
            ],
            multiplicity: ResponseMultiplicity.ONE
        }
        
    ],
    hostQuestions: [
        {
            id: 1,
            questionKey: 'smoking_allowed',
            text: 'Is smoking allowed inside your home?',
            responseValues: [
                CommonResponseValues.Yes.id,
                CommonResponseValues.No.id
            ],
            multiplicity: ResponseMultiplicity.ONE
        }
    ],
    restrictions: new Array<Restriction>(),
    matchResults: [
        {
            guestId: 1,
            hostId: 1,
            restrictionsFailed: [
                {
                    hostQuestionId: 1,
                    hostResponseValue: 'ok',
                    guestQuestionId: 1,
                    guestResponseValue: 'ok',
                    reasonText: 'Can not smoke'
                }
            ],
            guestInterestLevel: GuestInterestLevel.Unknown,
            lastInterestUpdate: new Date()
        },
        {
            guestId: 2,
            hostId: 1,
            restrictionsFailed: [
                {
                    hostQuestionId: 1,
                    hostResponseValue: 'ok',
                    guestQuestionId: 1,
                    guestResponseValue: 'ok',
                    reasonText: 'Can not smoke'
                }
            ],
            guestInterestLevel: GuestInterestLevel.Unknown,
            lastInterestUpdate: new Date()
        },
        {
            guestId: 3,
            hostId: 1,
            restrictionsFailed: [],
            guestInterestLevel: GuestInterestLevel.Interested,
            lastInterestUpdate: new Date()
        },
        {
            guestId: 4,
            hostId: 1,
            restrictionsFailed: [],
            guestInterestLevel: GuestInterestLevel.NotInterested,
            lastInterestUpdate: new Date()
        },
    ]
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

    // All Create, Update, Delete operations. 
    // Read operations are accessed directly from data.guests, etc
    const addGuest = (guest: Guest) => dispatch({ type: HostHomeActionType.AddGuest, payload: guest });
    // ...
    
    return {
        data,
        dispatch,
        addGuest
    };
};