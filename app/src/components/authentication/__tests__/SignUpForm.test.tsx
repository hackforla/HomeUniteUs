import {BrowserRouter} from 'react-router-dom';
import {describe, vi} from 'vitest';
import {render, screen, userEvent, fireEvent} from '../../../utils/test/test-utils';
import {SignUpForm, SignUpFormProps} from '../SignUpForm';
import {faker} from '@faker-js/faker';

const prepare = (initialProps: Partial<SignUpFormProps> = {}) => {
  const onSubmit = vi.fn();

  const props: SignUpFormProps = {
    onSubmit,
    type: 'coordinator',
    getTokenIsLoading: false,
    signUpCoordinatorIsLoading: false,
    signUpHostIsLoading: false,
    ...initialProps,
  };

  render(
    <BrowserRouter>
      <SignUpForm {...props} />
    </BrowserRouter>,
  );
  const firstNameInput = screen.getByLabelText(/first name/i);
  const lastNameInput = screen.getByLabelText(/last name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', {name: /sign up/i});

  return {
    onSubmit,
    firstNameInput,
    lastNameInput,
    emailInput,
    passwordInput,
    submitButton,
  };
};

describe('<SignUpForm />', () => {
  // what it should render
  it('should render', () => {
    const {emailInput, passwordInput} = prepare();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  // when correct special characters are added, it should pass validation form
  it('should pass password validation form with correct special characters', () => {
    const {passwordInput, submitButton} = prepare();
    fireEvent.change(passwordInput, {target: {value: 'Test123!'}});
    expect(submitButton).not.toBeDisabled;
  });

  // when special character not valid, password validation should be present
  it('should display error text when special character not present', () => {
    const {passwordInput, submitButton} = prepare();
    fireEvent.change(passwordInput, {target: {value: 'test123'}});
    expect(submitButton).toBeDisabled;
  });

  // test for unusual special characters
  it('should pass password validation form with unusual special characters', () => {
    const {passwordInput, submitButton} = prepare();
    fireEvent.change(passwordInput, {target: {value: '7væVPj¼±mó5÷ÙÞW'}});
    expect(submitButton).not.toBeDisabled;
  });
  it('submits all necessary information', async () => {
    const user = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: 'Test123!',
    };

    const {
      firstNameInput,
      lastNameInput,
      emailInput,
      passwordInput,
      submitButton,
      onSubmit,
    } = prepare();

    await userEvent.type(firstNameInput, user.firstName);
    await userEvent.type(lastNameInput, user.lastName);
    await userEvent.type(emailInput, user.email);
    await userEvent.type(passwordInput, user.password);
    await userEvent.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith(user);
  });

  it('displays loading spinner when token is loading', () => {
    const {submitButton} = prepare({getTokenIsLoading: true});

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays loading spinner when signing up as host', () => {
    const {submitButton} = prepare({signUpHostIsLoading: true});

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays loading spinner when signing up as coordinator', () => {
    const {submitButton} = prepare({signUpCoordinatorIsLoading: true});

    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
