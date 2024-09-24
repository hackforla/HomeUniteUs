import {
  render,
  screen,
  userEvent,
  fireEvent,
} from '../../../utils/test/test-utils';
import {CodeField} from '..';

describe('CodeField', () => {
  it('should render 6 text fields', () => {
    render(<CodeField id="test" />);
    expect(screen.getAllByRole('textbox')).toHaveLength(6);
  });

  it('should move focus to the next field when a value is entered', async () => {
    render(<CodeField id="test" />);
    const input = screen.getAllByRole('textbox')[0];
    const secondInput = screen.getAllByRole('textbox')[1];
    const thirdInput = screen.getAllByRole('textbox')[2];

    await userEvent.type(input, '1');
    expect(input).toHaveValue('1');
    expect(input).not.toHaveFocus();
    expect(secondInput).toHaveFocus();

    await userEvent.type(secondInput, '2');
    expect(secondInput).toHaveValue('2');
    expect(secondInput).not.toHaveFocus();
    expect(thirdInput).toHaveFocus();
  });

  it('should move focus to the previous field when backspace is pressed', async () => {
    render(<CodeField id="test" />);
    const input = screen.getAllByRole('textbox')[0];
    const secondInput = screen.getAllByRole('textbox')[1];
    const thirdInput = screen.getAllByRole('textbox')[2];

    await userEvent.type(input, '1');
    await userEvent.type(secondInput, '2');

    expect(thirdInput).toHaveFocus();
    fireEvent.keyDown(thirdInput, {key: 'Backspace'});
    expect(secondInput).toHaveFocus();
    expect(secondInput).toHaveValue('');

    fireEvent.keyDown(secondInput, {key: 'Backspace'});
    expect(input).toHaveValue('');
    expect(input).toHaveFocus();
  });

  it('calls onChange with the correct value', async () => {
    const onChange = vi.fn();
    render(<CodeField id="test" onChange={onChange} />);
    const input = screen.getAllByRole('textbox')[0];
    const input2 = screen.getAllByRole('textbox')[1];

    await userEvent.type(input, '1');
    expect(onChange).toHaveBeenCalledWith('1');

    await userEvent.type(input2, '2');
    expect(onChange).toHaveBeenCalledWith('12');
  });

  it.todo('should display error text');
});
