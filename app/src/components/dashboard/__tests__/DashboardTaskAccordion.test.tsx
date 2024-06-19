import {BrowserRouter} from 'react-router-dom';
import {render, screen, within} from '../../../utils/test/test-utils';
import {
  DashboardTaskAccordion,
  TaskAccordionProps,
} from '../DashboardTaskAccordion';

const task: TaskAccordionProps = {
  taskOrder: 1,
  title: 'Application and Onboarding',
  status: 'inProgress',
  subTasks: [
    {
      id: 1,
      title: 'Application',
      status: 'complete',
      description: 'Start your guest application to move on to the next step.',
      linkText: 'Start Application',
      url: '/guest-application',
    },
    {
      id: 2,
      title: 'Coordinator Interview',
      status: 'inProgress',
      description: 'Meet with your Coordinator to share more about yourself.',
      linkText: 'Schedule interview',
      url: '/schedule',
    },
    {
      id: 3,
      title: 'Training Session',
      status: 'locked',
      description:
        'Complete a training session to prepare you for the host home experience.',
      linkText: 'Schedule training',
      url: '/schedule',
    },
  ],
};

const setup = (props?: Partial<TaskAccordionProps>) => {
  const values = {
    ...task,
    ...props,
  };

  render(
    <BrowserRouter>
      <DashboardTaskAccordion {...values} />
    </BrowserRouter>,
  );

  const accordion = screen.getByRole('button', {
    name: /application and onboarding/i,
  });

  return {
    props: values,
    accordion,
  };
};

describe('DashboardTaskAccordion', () => {
  it('should render information about the task', () => {
    const {props} = setup();

    const completedTasks = props.subTasks.filter(
      ({status}) => status === 'complete',
    );

    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${completedTasks.length} of ${props.subTasks.length} tasks`,
      ),
    ).toBeInTheDocument();
  });

  it('should render the subtasks', () => {
    const {props} = setup();

    props.subTasks.forEach(({title}) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('should be expanded on render when in progress', () => {
    const {accordion} = setup();

    expect(accordion).toHaveAttribute('aria-expanded', 'true');
  });

  it('should render the step number when in progress', () => {
    setup();
    expect(screen.getByTestId('stepNumber')).toBeInTheDocument();
  });

  it('should render a lock icon when locked', () => {
    const {accordion} = setup({status: 'locked'});

    expect(within(accordion).getByTestId('LockIcon')).toBeInTheDocument();
  });

  it('should render a check icon when complete', () => {
    const {accordion} = setup({status: 'complete'});

    expect(
      within(accordion).getByTestId('CheckCircleOutlinedIcon'),
    ).toBeInTheDocument();
  });
});
