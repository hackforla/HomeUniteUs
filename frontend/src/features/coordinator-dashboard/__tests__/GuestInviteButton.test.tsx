import {BrowserRouter} from 'react-router-dom';
import {describe} from 'vitest';
import {faker} from '@faker-js/faker';
import {
  fireEvent,
  render,
  screen,
  userEvent,
} from '../../../utils/test/test-utils';
import {GuestInviteButton} from '../../coordinator-dashboard/GuestInviteButton';
import {server} from '../../../utils/test/server';
import {HttpResponse, http} from 'msw';

function createGuest() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
  };
}

function prepare() {
  render(
    <BrowserRouter>
      <GuestInviteButton />
    </BrowserRouter>,
  );

  const button = screen.getByRole('button', {name: /invite new guest/i});

  const openDialog = () => {
    fireEvent.click(button);
    const firstNameInput = screen.getByRole('textbox', {
      name: /first name/i,
      hidden: true,
    });

    const lastNameInput = screen.getByRole('textbox', {
      name: /last name/i,
      hidden: true,
    });

    const emailInput = screen.getByRole('textbox', {
      name: /email/i,
      hidden: true,
    });

    const submitButton = screen.getByRole('button', {
      name: /send invite/i,
      hidden: true,
    });

    const cancelButton = screen.getByRole('button', {
      name: /cancel/i,
      hidden: true,
    });

    return {
      firstNameInput,
      lastNameInput,
      emailInput,
      submitButton,
      cancelButton,
    };
  };

  return {
    button,
    openDialog,
  };
}

describe('<GuestInviteButton />', () => {
  it('should render a button', () => {
    const {button} = prepare();
    expect(button).toBeInTheDocument();
  });

  it('should open a dialog that conatins a form', () => {
    const {openDialog} = prepare();
    const {firstNameInput, lastNameInput, emailInput} = openDialog();
    expect(screen.getByRole('dialog', {hidden: true})).toBeInTheDocument();
    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
  });

  it('should close dialog when user presses cancel button', () => {
    const {openDialog} = prepare();
    const {cancelButton} = openDialog();
    fireEvent.click(cancelButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('submit the form and show a success message', async () => {
    const {openDialog, button} = prepare();
    const {firstName, lastName, email} = createGuest();
    const {firstNameInput, lastNameInput, emailInput, submitButton} =
      openDialog();
    fireEvent.change(firstNameInput, {target: {value: firstName}});
    fireEvent.change(lastNameInput, {target: {value: lastName}});
    fireEvent.change(emailInput, {target: {value: email}});
    fireEvent.click(submitButton);

    await screen.findByRole('button', {name: /done/i, hidden: true});

    fireEvent.click(screen.getByRole('button', {name: /done/i, hidden: true}));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('displays returned error messages', async () => {
    const message = 'There was an error sending the invite.';

    server.use(
      http.post('/api/auth/invite', () => {
        return HttpResponse.json(
          {
            message,
          },
          {status: 400},
        );
      }),
    );

    const {openDialog} = prepare();
    const {firstName, lastName, email} = createGuest();
    const {firstNameInput, lastNameInput, emailInput, submitButton} =
      openDialog();
    await userEvent.type(firstNameInput, firstName);
    await userEvent.type(lastNameInput, lastName);
    await userEvent.type(emailInput, email);
    await userEvent.click(submitButton);

    await screen.findByRole('alert', {hidden: true});
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('displays validation errors', async () => {
    const {openDialog} = prepare();
    const {submitButton} = openDialog();
    fireEvent.click(submitButton);

    await screen.findByText(/first name is required/i);
    await screen.findByText(/email is required/i);
  });
});
