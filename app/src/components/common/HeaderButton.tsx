import React from 'react';
import ChevronLeftSharp from '@mui/icons-material/ChevronLeftSharp';

interface HeaderButtonProps {
  hasDropDown: boolean;
  onClick: () => void;
}

export const HeaderAvatar = ({
  hasDropDown,
  onClick,
  children,
}: React.PropsWithChildren<HeaderButtonProps>) => {
  return (
    <button onClick={onClick}>
      <span>{children}</span>
      {hasDropDown ? <ChevronLeftSharp /> : null}
    </button>
  );
};
