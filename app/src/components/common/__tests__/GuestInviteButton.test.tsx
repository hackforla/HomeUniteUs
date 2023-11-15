import {BrowserRouter} from 'react-router-dom';
import {describe} from 'vitest';
import {fireEvent, render, screen} from '../../../utils/test/test-utils';
import {GuestInviteButton} from '../GuestInviteButton';

function prepare() {
  render(
    <BrowserRouter>
      <GuestInviteButton />
    </BrowserRouter>,
  );

  const button = screen.getByRole('button', {name: /invite guest/i});

  const openDialog = () => {
    fireEvent.click(button);
  };

  return {
    button,
    openDialog,
  };
}

describe('<GuestInviteButton />', () => {
  it('should render', () => {
    const {button} = prepare();
    expect(button).toBeInTheDocument();
  });

  it('should open dialog', () => {
    const {openDialog} = prepare();
    openDialog();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('should close dialog', () => {
    const {openDialog} = prepare();
    openDialog();
    const closeButton = screen.getByRole('button', {name: /cancel/i});
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
