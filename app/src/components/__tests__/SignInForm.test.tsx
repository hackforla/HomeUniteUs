import {fireEvent, render, screen} from '../../utils/test/test-utils';
import {SignInForm} from '../authentication/SignInForm';

const prepare = () => {
  const onSubmit = vi.fn();
  render(<SignInForm onSubmit={onSubmit} />);

  const emailInput = screen.getByRole('textbox', {name: /email/i});
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', {name: /sign in/i});

  return {onSubmit, emailInput, passwordInput, submitButton};
};

describe('Sign in form', () => {
  it('should render', () => {
    const {emailInput, passwordInput} = prepare();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('should change input values', () => {
    const {emailInput, passwordInput} = prepare();

    fireEvent.change(emailInput, {target: {value: 'test@gmail.com'}});
    fireEvent.change(passwordInput, {target: {value: 'password'}});

    expect(emailInput).toHaveValue('test@gmail.com');
    expect(passwordInput).toHaveValue('password');
  });

  it('should display error text', async () => {
    const {emailInput, passwordInput, submitButton} = prepare();

    fireEvent.change(emailInput, {target: {value: 'invalid'}});
    fireEvent.change(passwordInput, {target: {value: 'password'}});
    fireEvent.click(submitButton);

    await screen.findByText('email must be a valid email');
    await screen.findByText(/password must contain/i);
  });
});
