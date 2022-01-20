import React, {ReactElement, FC} from 'react';
import {render, RenderOptions} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ThemeProvider} from '@mui/material/styles';
import {HomeUniteUsTheme} from '../../theme';

const AllTheProviders: FC = ({children}) => {
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
