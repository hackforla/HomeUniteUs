import * as React from 'react'
import { Host } from '../models/v2'

const CaseworkerDashboardContext = React.createContext({})

interface Case {
  hostGroup: Array<Host>;
  // guestGroup: Array<Guest>; //there is no guest in ../models/v2
  caseWorkerId: string;
  id: string;
  status: Status; // we don't have this type yet either
  loaderState: {
    loading: boolean
    message: string
  }
};

interface Status {
  id: string;
  displayName: string; // values like "Pending Match", "Ready to Move In" etc
}

enum CaseWorkerDashboardActionType {
  BeginFetchingCases,
  FinishFetchingCases,
  isLoading,
  Error,
}

interface CaseworkerAction {
  type: CaseWorkerDashboardActionType
  payload?:
      | Case
      | Array<Host>
      // | Array<Guest>
      | string
      | any
}

const initialState: Case = {
  hostGroup: [],
  caseWorkerId: "",
  id: "",
  status: {
    id: "",
    displayName: ""
  },
  loaderState: {
      loading: false,
      message: '',
  },
}

const CaseworkerDashboardReducer = (state: Case, action: CaseworkerAction): Case => {
  switch(action.type){
    case CaseWorkerDashboardActionType.BeginFetchingCases: {
      return {
        ...state,
        loaderState: {
          loading: true,
          message: action.payload as string
        }
      }
    }
    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`)
  }
}

export function CaseworkerDashboardDataProvider(props: React.PropsWithChildren<{}>): void /*JSX.Element*/ {
  const [state, dispatch] = React.useReducer(CaseworkerDashboardReducer, initialState)
  
  //TODO: Need a Lifecycle method to fetch Cases on React.useEffect(() => {}, [])

  // return <CaseworkerDashboardContext.Provider value={value} {...props} /> 
}

// Create a hook to use the APIContext, this is a Kent C. Dodds pattern
export function useCaseworkerDashboard(){
  const context = React.useContext(CaseworkerDashboardContext)
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context
}