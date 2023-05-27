import {
  ResestPasswordValues,
  initialValues,
  validationSchema,
} from '../../components/authentication/ResetPasswordContext';
import {render, screen, waitFor, fireEvent} from '../../utils/test/test-utils';
import {ForgotPasswordCode} from '../ForgotPasswordCode';
import {BrowserRouter} from 'react-router-dom';
import {Formik} from 'formik';

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

  test('should display the form when the email is present', () => {
    setup();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    waitFor(() => expect(screen.queryByRole('form')).toBeInTheDocument());
  });

  test('should dispaly an error message when the email is missing', () => {
    setup({email: ''});

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    waitFor(() => expect(screen.queryByRole('alert')).toBeInTheDocument());
  });

  describe('If the code is invalid', () => {
    test('submit button should be disabled', () => {
      setup({code: ''});
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('If the code is valid', () => {
    test('submit button should be enabled and navigate to next page', () => {
      setup({code: '123456'});
      const submitButton = screen.getByRole('button', {name: /submit/i});

      expect(submitButton).toBeEnabled();
      fireEvent.click(submitButton);
      expect(navigate).toHaveBeenCalledWith('/forgot-password/reset');
    });
  });
});
