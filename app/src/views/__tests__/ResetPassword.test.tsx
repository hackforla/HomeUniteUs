import {
  ResestPasswordValues,
  initialValues,
  validationSchema,
} from '../../components/authentication/ResetPasswordContext';
import {render, screen, waitFor, fireEvent} from '../../utils/test/test-utils';
import {ResetPassword} from '../ResetPassword';
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
        initialValues={{
          ...initialValues,
          email: 'test@gmail.com',
          code: '123456',
          ...values,
        }}
        onSubmit={vi.fn()}
        validationSchema={validationSchema}
      >
        <ResetPassword />
      </Formik>
    </BrowserRouter>,
  );

  const passwordInput = screen.getByRole('textbox', {name: /password/i});
  const confirmPasswordInput = screen.getByRole('textbox', {
    name: /confirmPassword/i,
  });

  const submitButton = screen.getByRole('button', {name: /submit/i});

  return {passwordInput, confirmPasswordInput, submitButton};
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

  test('displays error message when passwords do not match', () => {
    const {passwordInput, confirmPasswordInput, submitButton} = setup();

    fireEvent.change(passwordInput, {target: {value: 'Password1!'}});
    fireEvent.change(confirmPasswordInput, {target: {value: 'Password2!'}});
    fireEvent.click(submitButton);

    screen.debug();
  });
});
