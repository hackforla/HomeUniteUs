import React, {ReactElement} from 'react';
import {render, cleanup, RenderOptions} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ThemeProvider} from '@mui/material/styles';
import {HomeUniteUsTheme} from '../../theme';
import {afterEach} from 'vitest';

afterEach(() => {
  cleanup();
});
interface ProviderProps {
  children: ReactElement;
}

const AllTheProviders = ({children}: ProviderProps) => {
  return <ThemeProvider theme={HomeUniteUsTheme}>{children}</ThemeProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, {wrapper: AllTheProviders, ...options});
};

export * from '@testing-library/react';
export {customRender as render, userEvent};
