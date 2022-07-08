import {describe} from 'vitest';
import {render, screen} from '../../utils/test/test-utils';
import {Input} from '../common/Input';

describe('Input', () => {
  it('should render', () => {
    render(
      <Input
        label="email"
        id="email"
        value={'fake@email.com'}
        errorMessage={undefined}
      />,
    );

    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByRole('textbox', {name: /email/i})).toBeInTheDocument();
  });

  it.only('should render error message', () => {
    const error = 'email is required';
    render(
      <Input
        label="email"
        id="email"
        value={'fake@email.com'}
        errorMessage={error}
        touched={true}
      />,
    );

    expect(screen.getByText(error)).toBeInTheDocument();
  });
});
