import React from 'react';
import {Button} from '../components/common/Button';
import {render, screen, userEvent} from '../utils/test/test-utils';

describe('Button', () => {
  test('Button renders with text and fires onClick', () => {
    const label = 'label';
    const onClick = jest.fn();
    render(<Button onClick={onClick} label={label} />);
    // screen.debug();
    const button = screen.getByRole('button', {name: /label/i});

    expect(button).not.toBeDisabled();

    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('onClick does not fire when disabled', () => {
    const label = 'label';
    const onClick = jest.fn();
    render(<Button disabled onClick={onClick} label={label} />);

    const button = screen.getByRole('button', {name: /label/i});

    expect(button).toBeDisabled();

    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
  });
});
