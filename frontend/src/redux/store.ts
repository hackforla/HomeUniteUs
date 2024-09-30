import {configureStore, combineReducers} from '@reduxjs/toolkit';
import type {PreloadedState} from '@reduxjs/toolkit';

import authReducer from './authSlice';
import guestProfileReducer from '../features/intake-profile/guetsProfileSlice';
import {api} from '../services/api';

const rootReducer = combineReducers({
  auth: authReducer,
  guestProfile: guestProfileReducer,
  [api.reducerPath]: api.reducer,
});

export const setupStore = (preloadedState?: PreloadedState<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware().concat(api.middleware),
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
