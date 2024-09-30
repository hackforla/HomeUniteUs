import {LinkProps} from '@mui/material/Link';
import {Components} from '@mui/material/styles';
import React from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom';

export const LinkBehavior = React.forwardRef<
  never,
  Omit<RouterLinkProps, 'to'> & {href: RouterLinkProps['to']}
>((props, ref) => {
  const {href, ...other} = props;
  // Map href (MUI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

LinkBehavior.displayName = 'LinkBehavior';

export const Link = (): Components => {
  return {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
        underline: 'hover',
      } as LinkProps,
    },
  };
};
