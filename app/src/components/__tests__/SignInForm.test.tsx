import {BrowserRouter} from 'react-router-dom';
import {describe, vi} from 'vitest';
import {fireEvent, render, screen} from '../../utils/test/test-utils';
import {SignInForm} from '../authentication/SignInForm';

const prepare = () => {
  const onSubmit = vi.fn();

  render(
    <BrowserRouter>
      <SignInForm
        onSubmit={onSubmit}
        signInIsLoading={false}
        getTokenIsLoading={false}
      />
    </BrowserRouter>,
  );

  const emailInput = screen.getByLabelText(/email/i);
  const passwordInput = screen.getByLabelText('Password');
  const submitButton = screen.getByRole('button', {name: /sign in/i});

  return {onSubmit, emailInput, passwordInput, submitButton};
};

describe('<SignInForm />', () => {
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
