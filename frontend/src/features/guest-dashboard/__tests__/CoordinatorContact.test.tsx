import {render, screen} from '../../../utils/testing/test-utils';
import {CoordinatorContact} from '../CoordinatorContact';

const setup = () => {
  const props = {
    image: 'https://placekitten.com/100/100',
    name: 'John Doe',
    email: 'johndoe@email.com',
    phone: '555-555-5555',
  };

  render(<CoordinatorContact {...props} />);

  return {
    props,
  };
};

describe('CoordinatorContact', () => {
  it('should render the coordinator information', () => {
    const {props} = setup();

    expect(screen.getByText(props.name)).toBeInTheDocument();
    expect(screen.getByText(props.email)).toBeInTheDocument();
    expect(screen.getByText(props.phone)).toBeInTheDocument();
  });
});
