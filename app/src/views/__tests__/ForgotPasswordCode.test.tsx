import {ResestPasswordValues} from '../../components/authentication/ResetPasswordContext';
import {render, screen} from '../../utils/test/test-utils';
import {ForgotPasswordCode} from '../ForgotPasswordCode';
import {BrowserRouter} from 'react-router-dom';

const setup = (formikValues: Partial<ResestPasswordValues> = {}) => {
  vi.mock('react-router-dom', async () => {
    const actual: object = await vi.importActual('react-router-dom');
    return {
      ...actual,
      useNavigate: () => ({
        navigate: vi.fn(),
      }),
    };
  });

  vi.mock('formik', async () => {
    const actual: object = await vi.importActual('formik');
    return {
      ...actual,
      useFormikContext: () => ({
        values: {
          code: '',
          email: '',
          password: '',
          confirmPassword: '',
          ...formikValues,
        },
        errors: {
          code: '',
        },
        touched: {
          code: '',
        },
        setFieldValue: vi.fn(),
      }),
    };
  });

  render(
    <BrowserRouter>
      <ForgotPasswordCode />
    </BrowserRouter>,
  );
};

describe('ForgotPasswordCode page', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should dispaly an error message when the email is missing', () => {
    setup();

    expect(screen.queryByRole('form')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
