import React from 'react';
import {BaseButton as Button} from '../components/common/Button';
import {render, screen, userEvent} from '../utils/test/test-utils';

describe('Button', () => {
  test('Button renders with text and fires onClick', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} />);
    // screen.debug();
    const button = screen.getByRole('button', {name: /label/i});

    expect(button).not.toBeDisabled();

    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('onClick does not fire when disabled', () => {
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick} />);

    const button = screen.getByRole('button', {name: /label/i});

    expect(button).toBeDisabled();

    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
