import React, {ReactElement, ReactNode} from 'react';
import {render, RenderOptions} from '@testing-library/react';
import {ThemeProvider} from '@mui/material/styles';
import {Provider} from 'react-redux';
import userEvent from '@testing-library/user-event';

import {HomeUniteUsTheme} from '../../theme';
import {PreloadedState} from '@reduxjs/toolkit';
import {setupStore, RootState, AppStore} from '../../redux/store';

interface ProviderProps {
  children: ReactNode;
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {},
) => {
  const AllTheProviders = ({children}: ProviderProps) => {
    return (
      <ThemeProvider theme={HomeUniteUsTheme}>
        <Provider store={store}>{children}</Provider>
      </ThemeProvider>
    );
  };

  return render(ui, {wrapper: AllTheProviders, ...renderOptions});
};

export * from '@testing-library/react';
export {customRender as render, userEvent};
