import {createSlice, PayloadAction} from '@reduxjs/toolkit';

import {User} from '../services/auth';
import {RootState} from './store';

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
    clearAuthState: state => {
      state.user = null;
      state.token = null;
    },
    setCredentials: (
      state,
      {payload: {user, token}}: PayloadAction<{user: User; token: string}>,
    ) => {
      state.user = user;
      state.token = token;
    },
    tokenReceived: (state, {payload: token}: PayloadAction<string>) => {
      state.token = token;
    },
  },
});

export default authSlice.reducer;
export const {
  clearAuthState,
  setCredentials,
  tokenReceived,
} = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
