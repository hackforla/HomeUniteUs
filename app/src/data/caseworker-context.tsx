import * as React from 'react'
import { Host } from '../models/v2'
import { Guest } from '../models'
import { useAuth0 } from '../react-auth0-spa' 

const CaseworkerDashboardContext = React.createContext({
  state: {} as CaseworkerDashboardState,
  dispatch: (() => {}) as any 
})

interface Case {
  // hostGroup?: Array<Host>;
  // guestGroup?: Array<Guest>; 
  guest_id: string;
  caseworker_id: string;
  _id: string;
  status_id: Status; 
};

interface Status {
  id: string;
  displayName: string; 
}

enum CaseWorkerDashboardActionType {
  BeginFetchingCases,
  FinishFetchingCases,
  Error,
}

interface CaseworkerAction {
  type: CaseWorkerDashboardActionType
  payload?:
      | Array<Case>
      | string
      | any
}

interface CaseworkerDashboardState {
  cases: Array<Case>,
  loaderState: {
    loading: boolean,
    message: string
  }
  caseworkerId: string
}

const initialState: CaseworkerDashboardState = {
  cases: [],
  caseworkerId: "",
  loaderState: {
      loading: false,
      message: '',
  },
}

const CaseworkerDashboardReducer = (state: CaseworkerDashboardState, action: CaseworkerAction): CaseworkerDashboardState => {
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
    case CaseWorkerDashboardActionType.FinishFetchingCases: {
      return {
        ...state,
        cases: action.payload as Array<Case>,
        loaderState: {
          ...state.loaderState,
          loading: false,
        }
      }
    }
    default:
      throw new Error(`Unsupported action: ${JSON.stringify(action)}`)
  }
}

export function CaseworkerDashboardDataProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const [state, dispatch] = React.useReducer(CaseworkerDashboardReducer, initialState)
  const { user } = useAuth0()

  const fetchingCases = async () => {
    try{ 
      dispatch({ type: CaseWorkerDashboardActionType.BeginFetchingCases, payload: "Loading Cases..." })

      const response: Response = await fetch('/api/case/get_cases', { // TODO: Hassen placeholder for now
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({caseworker_id: "5f9b0e52123b4b14c8eb828f"}) //testing here
      })
      if(response.status !== 200){
        return response.statusText
      }
      const caseworkerWithCases = await response.json()
      dispatch({ type: CaseWorkerDashboardActionType.FinishFetchingCases, payload: caseworkerWithCases.data })
    } catch(e){
      console.log(e, "<---------------error in context")
    }
  }
  
  React.useEffect(() => {
    fetchingCases()
  }, [])

  return <CaseworkerDashboardContext.Provider value={{state, dispatch}} {...props} /> 
}

export function useCaseworkerDashboard(){
  const context = React.useContext(CaseworkerDashboardContext) 
  if (context === undefined) {
    throw new Error("Context must be used within a Provider");
  }
  return context
}