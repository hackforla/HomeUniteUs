import {BrowserRouter} from 'react-router-dom';
import {describe, vi} from 'vitest';
import {fireEvent, render, screen} from '../../../utils/testing/test-utils';
import {SignInForm} from '../SignInForm';

const prepare = () => {
  const onSubmit = vi.fn();

  render(
    <BrowserRouter>
      <SignInForm
        onSubmit={onSubmit}
        isLoading={false}
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
});
