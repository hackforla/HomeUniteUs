import {
  ResestPasswordValues,
  initialValues,
  validationSchema,
} from '../../features/authentication/ResetPasswordContext';
import {
  render,
  screen,
  fireEvent,
  userEvent,
} from '../../utils/testing/test-utils';
import {ForgotPasswordCode} from '../authentication/ForgotPasswordCode';
import {BrowserRouter} from 'react-router-dom';
import {Formik} from 'formik';
// import {server} from '../../utils/testing/server';
// import {HttpResponse, http, delay} from 'msw';

const {navigate} = vi.hoisted(() => {
  return {
    navigate: vi.fn(),
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
  const user = userEvent.setup();

  render(
    <BrowserRouter>
      <Formik
        initialValues={{...initialValues, email: 'test@gmail.com', ...values}}
        onSubmit={vi.fn()}
        validationSchema={validationSchema}
      >
        <ForgotPasswordCode />
      </Formik>
    </BrowserRouter>,
  );

  return {
    user,
  };
};

describe('ForgotPasswordCode page', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should display the form when the email is present', () => {
    setup();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByTitle('Forgot Password Code')).toBeInTheDocument();
  });

  test('should display an error message when the email is missing', () => {
    setup({email: ''});

    expect(screen.queryByTitle('Forgot Password Code')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  describe('If the code is invalid', () => {
    test('submit button should be disabled', () => {
      setup({code: ''});
      const verifyButton = screen.getByRole('button', {name: /verify/i});

      expect(verifyButton).toBeDisabled();
    });
  });

  describe('If the code is valid', () => {
    test('submit button should be enabled and navigate to next page', () => {
      setup({code: '123456'});
      const verifyButton = screen.getByRole('button', {name: /verify/i});

      expect(verifyButton).toBeEnabled();
      fireEvent.click(verifyButton);
      expect(navigate).toHaveBeenCalledWith('/forgot-password/reset');
    });
  });

  describe('Resend code', () => {
    test('display a success message when the code is sent', async () => {
      setup();
      const resendButton = screen.getByRole('button', {name: /resend/i});

      await userEvent.click(resendButton);

      await screen.findByRole('alert');

      expect(screen.getByTestId(/success/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    // test('display an error message', async () => {
    //   server.use(
    //     http.post('/api/auth/forgot_password', async () => {
    //       await delay(100);
    //       return HttpResponse.json(
    //         {
    //           message: 'Invalid email address',
    //         },
    //         {status: 400},
    //       );
    //     }),
    //   );

    //   const {user} = setup();
    //   const resendButton = screen.getByRole('button', {name: /resend/i});

    //   await user.click(resendButton);

    //   expect(resendButton).toBeDisabled();

    //   await screen.findByRole('alert');

    //   expect(screen.getByTestId(/error/i)).toBeInTheDocument();
    //   expect(screen.getByRole('alert')).toBeInTheDocument();
    // });
  });
});
