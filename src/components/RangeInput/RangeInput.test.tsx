import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { RangeInput } from './RangeInput';

describe('RangeInput', () => {
  test('shows an error when the input is empty and keeps it after blur', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RangeInput
        id='min'
        label='Minimum'
        min={1}
        max={100}
        value={1}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Minimum in euros' });

    await user.clear(input);
    await user.tab();

    expect(screen.getByText('Enter a number')).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('min-error');
    expect(onChange).not.toHaveBeenCalled();
  });

  test('does not notify the parent for a value outside the allowed range', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RangeInput
        id='min'
        label='Minimum'
        min={1}
        max={100}
        value={1}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Minimum in euros' });

    await user.clear(input);
    await user.type(input, '0');

    expect(screen.getByText('Enter a value between 1 and 100')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('notifies the parent and removes the error when the value is corrected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <RangeInput
        id='min'
        label='Minimum'
        min={1}
        max={100}
        value={1}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Minimum in euros' });

    await user.clear(input);
    await user.type(input, '0');
    await user.clear(input);
    await user.type(input, '50');

    expect(onChange).toHaveBeenCalledWith(50, 'min');
    expect(screen.queryByText('Enter a value between 1 and 100')).toBeNull();
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(input.getAttribute('aria-describedby')).toBeNull();
  });

  test('discards an invalid draft when the value changes from outside', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <RangeInput
        id='min'
        label='Minimum'
        min={1}
        max={100}
        value={1}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Minimum in euros' });

    await user.clear(input);
    expect(screen.getByText('Enter a number')).toBeTruthy();

    rerender(
      <RangeInput
        id='min'
        label='Minimum'
        min={1}
        max={100}
        value={30}
        onChange={onChange}
      />,
    );

    expect(input).toHaveProperty('value', '30');
    expect(screen.queryByText('Enter a number')).toBeNull();
  });

  test('notifies the parent when an invalid draft becomes valid after the limits change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(
      <RangeInput
        id='max'
        label='Maximum'
        min={50}
        max={100}
        value={70}
        onChange={onChange}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Maximum in euros' });

    await user.clear(input);
    await user.type(input, '40');
    expect(screen.getByText('Enter a value between 50 and 100')).toBeTruthy();
    expect(onChange).not.toHaveBeenCalled();

    rerender(
      <RangeInput
        id='max'
        label='Maximum'
        min={30}
        max={100}
        value={70}
        onChange={onChange}
      />,
    );

    expect(screen.queryByText('Enter a value between 50 and 100')).toBeNull();
    expect(onChange).toHaveBeenCalledWith(40, 'max');
  });
});
