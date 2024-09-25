import {BrowserRouter} from 'react-router-dom';
import {Formik} from 'formik';
import {
  ResestPasswordValues,
  initialValues,
  validationSchema,
} from '../../features/authentication/ResetPasswordContext';
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from '../../utils/testing/test-utils';
import {ResetPassword} from '../authentication/ResetPassword';

interface Mocks {
  isError: boolean;
  error: string | undefined;
  isLoading: boolean;
}

const {navigate, onSubmit} = vi.hoisted(() => {
  return {
    navigate: vi.fn(),
    onSubmit: vi.fn(),
  };
});

const serviceMocks = vi.hoisted<Mocks>(() => {
  return {
    isError: false,
    error: undefined,
    isLoading: false,
  };
});

vi.mock('react-router-dom', async () => {
  const actual: object = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock('../../services/auth', async () => {
  const actual: object = await vi.importActual('../../services/auth');
  return {
    ...actual,
    useConfirmForgotPasswordMutation: () => {
      return [
        vi.fn(),
        {
          error: serviceMocks.error,
          isError: serviceMocks.isError,
          isLoading: serviceMocks.isLoading,
          reset: vi.fn(),
        },
      ];
    },
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
    expect(screen.getByTitle('Reset Password')).toBeInTheDocument();
  });

  test('should dispaly an error message when the email is missing', () => {
    setup({email: ''});

    expect(screen.queryByTitle('Reset Password')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('should dispaly an error message when the code is missing', () => {
    setup({code: ''});

    expect(screen.queryByTitle('Reset Password')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
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

  test('displays error message returned from server', () => {
    const errorMessage = 'There was an error';
    serviceMocks.isError = true;
    serviceMocks.error = errorMessage;

    setup();

    expect(screen.queryByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });

  test('Submit button is disabled and shows spinner when loading', () => {
    serviceMocks.isLoading = true;
    setup();

    const submitButton = screen.getByRole('button', {name: /submit/i});
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
