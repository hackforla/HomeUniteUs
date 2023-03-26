import {BrowserRouter} from 'react-router-dom';
import {describe, vi} from 'vitest';
import {fireEvent, render, screen} from '../../utils/test/test-utils';
import {SignInForm} from '../authentication/SignInForm';

const prepare = (errorMessage = '') => {
  const onSubmit = vi.fn();
  const setErrorMessage = vi.fn();

  render(
    <BrowserRouter>
      <SignInForm
        onSubmit={onSubmit}
        setErrorMessage={setErrorMessage}
        errorMessage={errorMessage}
      />
    </BrowserRouter>,
  );

  const emailInput = screen.getByRole('textbox', {name: /email/i});
  const passwordInput = screen.getByLabelText(/password/i);
  const submitButton = screen.getByRole('button', {name: /sign in/i});

  return {onSubmit, setErrorMessage, emailInput, passwordInput, submitButton};
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

  it('should display alert when error message is present', () => {
    const errorMessage = 'error';
    prepare(errorMessage);
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });

  it('clicking the close button calls setErrorMessage', async () => {
    const errorMessage = 'error';
    const {setErrorMessage} = prepare(errorMessage);
    const closeButton = screen.getByRole('button', {name: /close/i});
    fireEvent.click(closeButton);
    expect(setErrorMessage).toHaveBeenCalledWith('');
  });
});
