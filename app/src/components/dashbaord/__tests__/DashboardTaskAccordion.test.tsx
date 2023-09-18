import {BrowserRouter} from 'react-router-dom';
import {render, screen} from '../../../utils/test/test-utils';
import {TaskAccordion, TaskAccordionProps} from '../DashboardTaskAccordion';

const task: TaskAccordionProps = {
  stepNumber: 1,
  title: 'Application and Onboarding',
  status: 'in-progress',
  subTasks: [
    {
      id: 'submit_application',
      title: 'Application',
      status: 'complete',
      description: 'Start your guest application to move on to the next step.',
      buttonTitle: 'Start Application',
      route: '/guest-application',
    },
    {
      id: 'interview_with_coordinator',
      title: 'Coordinator Interview',
      status: 'in-progress',
      description: 'Meet with your Coordinator to share more about yourself.',
      buttonTitle: 'Schedule interview',
      route: '/schedule',
    },
    {
      id: 'attend_training_session',
      title: 'Training Session',
      status: 'locked',
      description:
        'Complete a training session to prepare you for the host home experience.',
      buttonTitle: 'Schedule training',
      route: '/schedule',
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
      <TaskAccordion {...values} />
    </BrowserRouter>,
  );

  return {
    props: values,
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

  it('should render a list of subtasks', () => {
    setup();
    expect(screen.getByTestId('tasks')).toBeInTheDocument();
    screen.debug();
  });

  it('should render the step number when in progress', () => {
    setup();
    expect(screen.getByTestId('stepNumber')).toBeInTheDocument();
  });

  it('should render a lock icon when locked', () => {
    setup({status: 'locked'});
    expect(screen.getByTestId('LockIcon')).toBeInTheDocument();
  });

  it('should render a check icon when complete', () => {
    setup({status: 'complete'});
    expect(screen.getByTestId('CheckCircleOutlinedIcon')).toBeInTheDocument();
  });
});
