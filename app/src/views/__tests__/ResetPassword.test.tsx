import {BrowserRouter} from 'react-router-dom';
import {Formik} from 'formik';
import {
  ResestPasswordValues,
  initialValues,
  validationSchema,
} from '../../components/authentication/ResetPasswordContext';
import {render, screen, waitFor, fireEvent} from '../../utils/test/test-utils';
import {ResetPassword} from '../ResetPassword';

const {navigate, onSubmit} = vi.hoisted(() => {
  return {
    navigate: vi.fn(),
    onSubmit: vi.fn(),
  };
});

vi.mock('react-router-dom', async () => {
  const actual: object = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

const setup = (values: Partial<ResestPasswordValues> = {}) => {
  const email = 'test@gmail.com';
  const code = '123456';

  render(
    <BrowserRouter>
      <Formik
        initialValues={{
          ...initialValues,
          email,
          code,
          ...values,
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <ResetPassword />
      </Formik>
    </BrowserRouter>,
  );

  return {email, code};
};

describe('ResetPassword page', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should display the form when the email and code are present', () => {
    setup();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    waitFor(() => expect(screen.queryByRole('form')).toBeInTheDocument());
  });

  test('should dispaly an error message when the email is missing', () => {
    setup({email: ''});

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument());
  });

  test('should dispaly an error message when the code is missing', () => {
    setup({code: ''});

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument());
  });

  test('Submits form with all data and matching password', async () => {
    const {email, code} = setup();
    const password = 'Password1!';

    const passwordInput = screen.getByLabelText('New password');
    const confirmPasswordInput = screen.getByLabelText('Confirm new password');
    const submitButton = screen.getByRole('button', {name: /submit/i});

    fireEvent.change(passwordInput, {target: {value: password}});
    fireEvent.change(confirmPasswordInput, {target: {value: password}});
    fireEvent.click(submitButton);

    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        {
          code,
          confirmPassword: password,
          email,
          password,
        },
        expect.anything(),
      ),
    );
  });

  test.skip('Displays error message returned from server', async () => {
    setup();

    const passwordInput = screen.getByLabelText('New password');
    const confirmPasswordInput = screen.getByLabelText('Confirm new password');
    const submitButton = screen.getByRole('button', {name: /submit/i});

    fireEvent.change(passwordInput, {target: {value: 'Password1!'}});
    fireEvent.change(confirmPasswordInput, {target: {value: 'Password1!'}});
    fireEvent.click(submitButton);

    await screen.findByRole('alert');

    screen.debug();
  });
});
