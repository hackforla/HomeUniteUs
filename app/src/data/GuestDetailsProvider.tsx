import * as React from "react";
import { Activity, Guest, Host } from "../models";

// interface GuestDashboardUtils {
//   data: GuestDetails;
//   // refreshActivitiesStub: () => void;
//   refreshActivities: () => void;
// }

interface GuestDashboardUtils {
  state: GuestDetails;
  dispatch: React.Dispatch<GuestDetailsAction>;
}

// our Context object, which we will use to create a Provider
const GuestContext = React.createContext<GuestDashboardUtils | null>(null);

// user props that will drive initialization and memoization
interface GuestDetailsProviderProps {}

// full model of information used in the dashboard
interface GuestDetails {
  guest: DataState<Guest>;
  matchedHosts: DataState<Host[]>;
  activities: DataState<Activity[]>;
}

// abstraction to allow us to set isLoading flags for stateful data
interface DataState<T> {
  data: T;
  isLoading: boolean;
}

// initial dummy values for data state
const DEFAULT_GUEST_DASHBOARD_DATA: GuestDetails = {
  guest: { data: {}, isLoading: false } as DataState<Guest>,
  matchedHosts: { data: [], isLoading: false } as DataState<Host[]>,
  activities: { data: [], isLoading: false } as DataState<Activity[]>,
};

// all data-related action types, these will affect elements of the
//   "state" of our fetched data
enum GuestDetailsActionType {
  FetchActivities = "FetchActivities",
  LoadActivities = "LoadActivities",
}

// an action type, together with a payload, describes the state transition
//   that will be applied in the reducer
interface GuestDetailsAction {
  type: GuestDetailsActionType;
  payload?: Guest | Host[] | Activity[];
}

// apply changes to the state based on
//   the action's type and payload
function reducer(
  // current state of system data
  state: GuestDetails,
  // a data-related action
  action: GuestDetailsAction
): GuestDetails {
  switch (action.type) {
    case GuestDetailsActionType.FetchActivities:
      return {
        ...state,
        activities: {
          ...state.activities,
          isLoading: true,
        },
      };

    case GuestDetailsActionType.LoadActivities:
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
//  any components using the useGuestDetails hook must be
//  a descendant of this Provider
export function GuestDetailsProvider(
  props: React.PropsWithChildren<GuestDetailsProviderProps>
) {
  console.log(`GuestDetailsProvider ctor`);
  // memo with no watch list means this value never needs to be recomputed
  const initialState = React.useMemo(() => DEFAULT_GUEST_DASHBOARD_DATA, []);

  // we will manage this state internally to this context provider / hook
  const [state, dispatch] = React.useReducer(reducer, initialState);

  // set the isLoading for activities to true, perform the fetch, then
  //   turn off isLoading and populate the state
  async function refreshActivities() {
    // turns on any loaders/spinners subscribed to isLoading for activity data
    //    while we call the API
    dispatch({ type: GuestDetailsActionType.FetchActivities });

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
      type: GuestDetailsActionType.LoadActivities,
      payload: activities,
    });
  }

  // only update what consumers are using when the state changes
  const utils = React.useMemo(() => ({ state, dispatch }), [state]);

  return <GuestContext.Provider value={utils} {...props} />;
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

export function useGuestDetails() {
  const ctx = React.useContext(GuestContext) as GuestDashboardUtils;
  if (!ctx) {
    throw new Error(
      `useGuestDetails can only be called in a descendant of a GuestDetailsProvider`
    );
  }
  const { state, dispatch } = ctx;

  /*
    TODO: We are returning state and dispatch directly to the client component here
      But instead we should define the subset of state that the component(s) need and
        the required state-changing operations. These should ideally be wrapped in
        meaningful function names, e.g. `updateGuestProfilePhoto`
   */
  return {
    state,
    dispatch,
  };
}
