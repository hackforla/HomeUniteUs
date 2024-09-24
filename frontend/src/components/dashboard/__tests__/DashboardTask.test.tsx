import {BrowserRouter} from 'react-router-dom';
import {render, screen, userEvent} from '../../../utils/test/test-utils';
import {DashboardTask, DashboardTaskProps} from '../DashboardTask';

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

function setup(props?: Partial<DashboardTaskProps>) {
  const values: DashboardTaskProps = {
    title: 'Application',
    status: 'inProgress',
    description: 'Start your guest application to move on to the next step.',
    linkText: 'Start Application',
    url: '/guest-application',
    ...props,
  };

  render(
    <BrowserRouter>
      <DashboardTask {...values} />
    </BrowserRouter>,
  );

  return {props: values};
}

describe('DashboardTask', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render information about the task', () => {
    const {props} = setup();

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
  });

  describe('when the task is in progress', () => {
    it('should render a link to start the task', async () => {
      userEvent.setup();

      const {props} = setup();
      const link = screen.getByRole('link', {name: props.linkText});

      expect(link).toBeInTheDocument();
      expect(link).not.toBeDisabled();
    });

    it('should render clock icon', () => {
      setup();

      expect(screen.getByTestId('AccessTimeIcon')).toBeInTheDocument();
    });
  });

  describe('when the task is complete', () => {
    it('should render a disabled link', () => {
      const {props} = setup({status: 'complete'});
      const link = screen.getByRole('link', {name: props.linkText});

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('should render check icon', () => {
      setup({status: 'complete'});

      expect(screen.getByTestId('CheckCircleOutlinedIcon')).toBeInTheDocument();
    });
  });

  describe('when the task is locked', () => {
    it('should render "Upcoming"', () => {
      const {props} = setup({status: 'locked'});

      expect(
        screen.queryByRole('link', {name: props.linkText}),
      ).not.toBeInTheDocument();
      expect(screen.getByText('Upcoming')).toBeInTheDocument();
    });

    it('should render lock icon', () => {
      setup({status: 'locked'});

      expect(screen.getByTestId('LockIcon')).toBeInTheDocument();
    });
  });
});
