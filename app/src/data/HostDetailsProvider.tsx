import * as React from "react";
import { Activity, Guest, Host } from "../models";

// interface HostDashboardUtils {
//   data: HostDetails;
//   // refreshActivitiesStub: () => void;
//   refreshActivities: () => void;
// }

interface HostDashboardUtils {
  state: HostDetails;
  dispatch: React.Dispatch<HostDetailsAction>;
}

// our Context object, which we will use to create a Provider
const HostContext = React.createContext<HostDashboardUtils | null>(null);

// user props that will drive initialization and memoization
interface HostDetailsProviderProps {}

// full model of information used in the dashboard
interface HostDetails {
  host: DataState<Host>;
  matchedGuests: DataState<Guest[]>;
  activities: DataState<Activity[]>;
}

// abstraction to allow us to set isLoading flags for stateful data
interface DataState<T> {
  data: T;
  isLoading: boolean;
}

// initial dummy values for data state
const DEFAULT_HOST_DASHBOARD_DATA: HostDetails = {
  host: { data: {}, isLoading: false } as DataState<Host>,
  matchedGuests: { data: [], isLoading: false } as DataState<Guest[]>,
  activities: { data: [], isLoading: false } as DataState<Activity[]>,
};

// all data-related action types, these will affect elements of the
//   "state" of our fetched data
enum HostDetailsActionType {
  FetchActivities = "FetchActivities",
  LoadActivities = "LoadActivities",
}

// an action type, together with a payload, describes the state transition
//   that will be applied in the reducer
interface HostDetailsAction {
  type: HostDetailsActionType;
  payload?: Host | Host[] | Activity[];
}

// apply changes to the state based on
//   the action's type and payload
function reducer(
  // current state of system data
  state: HostDetails,
  // a data-related action
  action: HostDetailsAction
): HostDetails {
  switch (action.type) {
    case HostDetailsActionType.FetchActivities:
      return {
        ...state,
        activities: {
          ...state.activities,
          isLoading: true,
        },
      };

    case HostDetailsActionType.LoadActivities:
      return {
        ...state,
        activities: {
          ...state.activities,
          data: action.payload as Activity[],
          isLoading: false,
        },
      };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

// initialize state, define data fetching / state change functions
//  any components using the useHostDetails hook must be
//  a descendant of this Provider
export function HostDetailsProvider(
  props: React.PropsWithChildren<HostDetailsProviderProps>
) {
  console.log(`HostDetailsProvider ctor`);
  // memo with no watch list means this value never needs to be recomputed
  const initialState = React.useMemo(() => DEFAULT_HOST_DASHBOARD_DATA, []);

  // we will manage this state internally to this context provider / hook
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // set the isLoading for activities to true, perform the fetch, then
  //   turn off isLoading and populate the state
  async function refreshActivities() {
    // turns on any loaders/spinners subscribed to isLoading for activity data
    //    while we call the API
    dispatch({ type: HostDetailsActionType.FetchActivities });

    // make the API call and parse the response
    const response = await fetch(`/api/activities`);
    if (response.status !== 200) {
      throw new Error(
        `Bad response from server: \n\tstatus: ${response.status}\n\t${response.statusText}`
      );
    }
    const activities = await response.json();

    // turn off the activity isLoading state and refresh the activities array
    dispatch({
      type: HostDetailsActionType.LoadActivities,
      payload: activities,
    });
  }

  // only update what consumers are using when the state changes
  const utils = React.useMemo(() => ({ state, dispatch }), [state]);

  return <HostContext.Provider value={utils} {...props} />;
}

function waitThreeSecs(): Promise<void> {
  console.log(`waitThreeSecs`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(`waitThreeSecs: time up`);
      resolve();
    }, 3000);
  });
}

export function useHostDetails() {
  const ctx = React.useContext(HostContext) as HostDashboardUtils;
  if (!ctx) {
    throw new Error(
      `useHostDetails can only be called in a descendant of a HostDetailsProvider`
    );
  }
  const { state, dispatch } = ctx;

  /*
    TODO: We are returning state and dispatch directly to the client component here
      But instead we should define the subset of state that the component(s) need and
        the required state-changing operations. These should ideally be wrapped in
        meaningful function names, e.g. `updateHostProfilePhoto`
   */
  return {
    state,
    dispatch,
  };
}
