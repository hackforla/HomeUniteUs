import {BrowserRouter} from 'react-router-dom';
import {describe, vi} from 'vitest';
import {render, screen, fireEvent} from '../../utils/test/test-utils';
import {SignUpForm} from '../authentication/SignUpForm';

const prepare = () => {
  const onSubmit = vi.fn();

  render(
    <BrowserRouter>
      <SignUpForm
        onSubmit={onSubmit}
        getTokenIsLoading={false}
        signUpHostIsLoading={false}
        signUpCoordinatorIsLoading={false}
        type="host"
      />
    </BrowserRouter>,
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', {name: /sign up/i});
  const passwordValidation = screen.getByLabelText(
    'password must contain at least one special character',
  );
  return {
    onSubmit,
    emailInput,
    passwordInput,
    submitButton,
    passwordValidation,
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
    const {passwordInput, passwordValidation} = prepare();
    fireEvent.change(passwordInput, {target: {value: 'test123!'}});
    expect(passwordValidation).not.toBeInTheDocument();
  });

  // when special character not valid, password validation should be present
  it('should display error text when special character not present', () => {
    const {passwordInput, passwordValidation} = prepare();
    fireEvent.change(passwordInput, {target: {value: 'test123'}});
    expect(passwordValidation).toBeInTheDocument();
  });

  // test for unusual special characters
  it('should pass password validation form with unusual special characters', () => {
    const {passwordInput, passwordValidation} = prepare();
    fireEvent.change(passwordInput, {target: {value: '7væVPj¼±mó5÷ÙÞW'}});
    expect(passwordValidation).toBeInTheDocument();
  });
});
