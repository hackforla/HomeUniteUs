import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {User} from '../services/user';
import {RootState} from './store';
// import {authApi} from '../services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
}

// define initial state
const initialState: AuthState = {
  user: null,
  token: null,
};

// Create auth slice with reducers and actions
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      {payload: {user, token}}: PayloadAction<AuthState>,
    ) => {
      state.user = user;
      state.token = token;
    },
    tokenReceived: (state, {payload: token}: PayloadAction<string>) => {
      state.token = token;
    },
  },
  // extraReducers: builder => {
  //   builder
  //     // Add a matcher to update auth state with user returned from the user query
  //     .addMatcher(
  //       userAPI.endpoints.currentUser.matchFulfilled,
  //       (state, {payload}) => {
  //         state.user = payload;
  //       },
  //     )
  //     .addMatcher(
  //       authApi.endpoints.session.matchFulfilled,
  //       (state, {payload}) => {
  //         state.user = payload.user;
  //         state.token = payload.token;
  //       },
  //     );
  // },
});

export default authSlice.reducer;
export const {setCredentials, tokenReceived} = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
