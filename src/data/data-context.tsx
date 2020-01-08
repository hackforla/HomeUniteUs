import * as React from "react";
import { Guest, Host, GuestQuestion, HostQuestion, Restriction, MatchResult, GuestInterestLevel, ResponseMultiplicity, GuestResponse, HostResponse } from "../models";
import { CommonResponseValues, ResponseValue } from "../models/ResponseValue";


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
    responseValues: Array<ResponseValue>;
    guestResponses: Array<GuestResponse>;
    hostResponses: Array<HostResponse>;
};

enum HostHomeActionType {
    AddGuest
};

interface HostHomeAction {
    type: HostHomeActionType;
    payload: Guest;
};

function hostHomeDataReducer(state: HostHomeData, action: HostHomeAction): HostHomeData {
    switch (action.type) {
        case HostHomeActionType.AddGuest:
            return {
                ...state,
                guests: [...state.guests, { id: 1, name: 'tyler', imageUrl: '/img/photo.jpg' }]
            };
        default:
            throw new Error(`Unsupported action: ${JSON.stringify(action)}`);
    }
};

const initialState: HostHomeData = {
    guests: [
        {
            name: 'John',
            id: 1,
            imageUrl: '/hosthome/img/profile-placeholder.png'
        },
        {
            name: 'Jane',
            id: 2,
            imageUrl: '/hosthome/img/profile-placeholder.png'
        },
        {
            name: 'Jim',
            id: 3,
            imageUrl: '/hosthome/img/profile-placeholder.png'
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
            responseValues: [2000,2001],
            multiplicity: ResponseMultiplicity.ONE
        }
        
    ],
    hostQuestions: [
        {
            id: 1,
            questionKey: 'smoking_allowed',
            text: 'Is smoking allowed inside your home?',
            responseValues: [1000,1001],
            multiplicity: ResponseMultiplicity.ONE
        }
    ],
    restrictions: [
        {
            hostQuestionId: 1,
            guestQuestionId: 1,
            reasonText: '',
            hostResponseValue: 1001,
            guestResponseValue: 2000
        }
    ],
    matchResults: [
        // {
        //     guestId: 1,
        //     hostId: 1,
        //     restrictionsFailed: [
        //         {
        //             hostQuestionId: 1,
        //             hostResponseValue: 1,
        //             guestQuestionId: 1,
        //             guestResponseValue: 1,
        //             reasonText: 'Can not smoke'
        //         }
        //     ],
        //     guestInterestLevel: GuestInterestLevel.Unknown,
        //     lastInterestUpdate: new Date()
        // },
        // {
        //     guestId: 2,
        //     hostId: 1,
        //     restrictionsFailed: [
        //         {
        //             hostQuestionId: 1,
        //             hostResponseValue: 1001,
        //             guestQuestionId: 1,
        //             guestResponseValue: 2000,
        //             reasonText: 'Can not smoke'
        //         }
        //     ],
        //     guestInterestLevel: GuestInterestLevel.Unknown,
        //     lastInterestUpdate: new Date()
        // },
        // {
        //     guestId: 3,
        //     hostId: 1,
        //     restrictionsFailed: [],
        //     guestInterestLevel: GuestInterestLevel.Interested,
        //     lastInterestUpdate: new Date()
        // },
        // {
        //     guestId: 4,
        //     hostId: 1,
        //     restrictionsFailed: [],
        //     guestInterestLevel: GuestInterestLevel.NotInterested,
        //     lastInterestUpdate: new Date()
        // },
    ],
    responseValues: [
        {
            id:1000,
            text: 'Yes',
            displayText: 'Smoking is allowed'
        },
        {
            id:1001,
            text: 'No',
            displayText: 'Smoking is not allowed'
        },
        {
            id:2000,
            text: 'Yes',
            displayText: 'Smokes'
        },
        {
            id:2001,
            text: 'No',
            displayText: 'Does not smoke'
        },
        {
            id:2002,
            text: 'Yes',
            displayText: 'Can live with smoking'
        },
        {
            id:2003,
            text: 'Yes',
            displayText: 'Prefers not to live where smoking is allowed'
        }
    ],
    hostResponses: [
        {
            hostId: 1,
            responseValues: [1001],
            questionId: 1,            
        }
    ],
    guestResponses: [
        {
            guestId: 1,
            responseValues: [2000],
            questionId: 1,            
        }
    ]
};

interface RestrictionMap {
    [hostId: string]: Array<number>;
}

export const computeInitialMatches = () => {   

    /*
        for all g in guests:
            for all h in hosts:
                for all r in restrictions:
                    gr := g.responses.where(resp.questionId = r.questionId)
                    hr = 
     */

     const restrictedPairs: RestrictionMap = {};
     initialState.hosts.forEach((host: Host) => {
         restrictedPairs[host.id] = new Array<number>();    
     });

     

     initialState.restrictions.forEach((restriction: Restriction) => {

        const hostResponses = initialState.hostResponses.filter((hostResponse: HostResponse) => {
            return hostResponse.responseValues.find((rvId: number) => rvId === restriction.hostResponseValue) !== undefined;
        });

        const guestResponses = initialState.guestResponses.filter((guestResponse: GuestResponse) => {
            return guestResponse.responseValues.find((rvId: number) => rvId === restriction.guestResponseValue) !== undefined;
        });

        // add each pair to the restricted
        hostResponses.forEach((hostResponse: HostResponse) => {       
     
            guestResponses.forEach((guestResponse: GuestResponse) => {
                restrictedPairs[hostResponse.hostId].push(guestResponse.guestId);

                const existingResult = initialState.matchResults.find(
                    (matchResult: MatchResult) => {
                        return matchResult.hostId === hostResponse.hostId
                            && matchResult.guestId === guestResponse.guestId;
                    }
                );

                if(!existingResult) {
                    initialState.matchResults.push({
                        hostId: hostResponse.hostId,
                        guestId: guestResponse.guestId,
                        restrictionsFailed: [restriction],
                        guestInterestLevel: GuestInterestLevel.Unknown,
                        lastInterestUpdate: new Date()
                    })
                } else {
                    existingResult.restrictionsFailed.push(restriction);
                }

            });
        });
     });

     initialState.hosts.forEach((host: Host) => {
         initialState.guests.forEach((guest: Guest) => {
            if(restrictedPairs[host.id].find((guestId: number) => guestId === guest.id) === undefined) {
                initialState.matchResults.push({
                    hostId: host.id,
                    guestId: guest.id,
                    restrictionsFailed: [],
                    guestInterestLevel: GuestInterestLevel.Unknown,
                    lastInterestUpdate: new Date()
                });
            }
         });
     });

};


export function HostHomeDataProvider(props: React.PropsWithChildren<{}>): JSX.Element {

    computeInitialMatches();
    console.log(`HostHomeDataProvider: initialState = ${JSON.stringify(initialState)}`);

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