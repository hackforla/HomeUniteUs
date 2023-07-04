import {
  ResestPasswordValues,
  initialValues,
  validationSchema,
} from '../../components/authentication/ResetPasswordContext';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  waitForElementToBeRemoved,
} from '../../utils/test/test-utils';
import {ForgotPasswordCode} from '../ForgotPasswordCode';
import {BrowserRouter} from 'react-router-dom';
import {Formik} from 'formik';
import {server, rest} from '../../utils/test/server';

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
};

describe('ForgotPasswordCode page', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should display the form when the email is present', async () => {
    setup();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    waitFor(() => expect(screen.getByRole('form')).toBeInTheDocument());
  });

  test('should dispaly an error message when the email is missing', async () => {
    setup({email: ''});

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
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

      fireEvent.click(resendButton);

      await screen.findByRole('alert');

      expect(screen.getByTestId(/success/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    test('display an error message', async () => {
      server.use(
        rest.post(
          'http://localhost:4040/api/auth/forgot_password',
          (req, res, ctx) => {
            return res(
              ctx.status(400),
              ctx.json({message: 'There was an error'}),
            );
          },
        ),
      );

      setup();
      const resendButton = screen.getByRole('button', {name: /resend/i});

      fireEvent.click(resendButton);
      expect(resendButton).toBeDisabled();

      await waitForElementToBeRemoved(() => screen.queryByRole('progressbar'));

      expect(screen.getByTestId(/error/i)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
