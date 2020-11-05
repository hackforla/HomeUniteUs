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

const caseworkerDashboardReducer = (state: Case, action: CaseworkerAction): Case => {
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

export function CaseworkerDashboardDataProvider(props: React.PropsWithChildren<{}>): JSX.Element {
  const [start, dispatch] = React.useReducer(caseworkerDashboardReducer, initialState)

  return <CaseworkerDashboardContext.Provider value={value} {...props} />
}