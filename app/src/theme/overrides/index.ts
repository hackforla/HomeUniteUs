import {Theme} from '@mui/material';
import {OutlinedInput} from './OutlinedInput';
import {InputLabel} from './InputLabel';

/**
 * Merge component overrides into a single object to be used by the theme.
 * @param theme Theme to merge overrides into and pass to overrides
 * @returns Object containing merged components
 */

export const componentOverrides = (theme: Theme) => {
  // Array of component overrides
  const components = [OutlinedInput(theme), InputLabel(theme)];

  // Reduce components into a single object
  return components.reduce((accum, curr) => {
    return {...accum, ...curr};
  }, {});
};
