import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import Range from '@/components/Range/Range';

describe('Range', () => {
  test('shows an error when the minimum is greater than the maximum', () => {
    render(
      <Range
        mode='continuous'
        min={100}
        max={1}
      />,
    );

    expect(screen.getByText('Invalid range limits.')).toBeTruthy();
  });

  test('shows an error when the minimum and maximum are equal', () => {
    render(
      <Range
        mode='continuous'
        min={50}
        max={50}
      />,
    );

    expect(screen.getByText('Invalid range limits.')).toBeTruthy();
  });

  test.each([
    { min: NaN, max: 100 },
    { min: 1, max: Infinity },
    { min: -Infinity, max: 100 },
    { min: 1, max: NaN },
  ])('shows an error for non-finite limits', ({ min, max }) => {
    render(
      <Range
        mode='continuous'
        min={min}
        max={max}
      />,
    );
    expect(screen.getByText('Invalid range limits.')).toBeTruthy();
  });

  test('shows the initial range values', () => {
    render(
      <Range
        mode='continuous'
        min={1}
        max={100}
      />,
    );

    expect(
      screen.getByRole('spinbutton', { name: 'Minimum in euros' }),
    ).toHaveProperty('value', '1');
    expect(
      screen.getByRole('spinbutton', { name: 'Maximum in euros' }),
    ).toHaveProperty('value', '100');
  });

  test('shows an error when the minimum is below the allowed range', async () => {
    const user = userEvent.setup();
    render(
      <Range
        mode='continuous'
        min={1}
        max={100}
      />,
    );

    const input = screen.getByRole('spinbutton', { name: 'Minimum in euros' });
    await user.clear(input);
    await user.type(input, '0');

    expect(screen.getByText('Enter a value between 1 and 100')).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  test('shows an error when the maximum is above the allowed range', async () => {
    const user = userEvent.setup();
    render(
      <Range
        mode='continuous'
        min={1}
        max={100}
      />,
    );

    const input = screen.getByRole('spinbutton', { name: 'Maximum in euros' });
    await user.clear(input);
    await user.type(input, '101');

    expect(screen.getByText('Enter a value between 1 and 100')).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  test('moves the minimum handle when its input changes to a valid value', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Range
        mode='continuous'
        min={0}
        max={100}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Minimum in euros' });
    const handle = container.querySelector<HTMLElement>(
      '[aria-hidden="true"] > span[style]',
    );

    expect(handle?.style.left).toBe('0%');

    await user.clear(input);
    await user.type(input, '50');

    expect(handle?.style.left).toBe('50%');
  });

  test('keeps the minimum handle at its last valid value when the input is invalid', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Range
        mode='continuous'
        min={1}
        max={100}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Minimum in euros' });
    const handle = container.querySelector<HTMLElement>(
      '[aria-hidden="true"] > span[style]',
    );

    await user.clear(input);
    await user.type(input, '50');
    const lastValidPosition = handle?.style.left;
    expect(lastValidPosition).not.toBe('0%');

    await user.clear(input);
    await user.type(input, '0');

    expect(handle?.style.left).toBe(lastValidPosition);
    expect(screen.getByText('Enter a value between 1 and 100')).toBeTruthy();
  });

  test('does not allow the minimum to exceed the selected maximum', async () => {
    const user = userEvent.setup();
    render(
      <Range
        mode='continuous'
        min={1}
        max={100}
      />,
    );
    const minimum = screen.getByRole('spinbutton', {
      name: 'Minimum in euros',
    });
    const maximum = screen.getByRole('spinbutton', {
      name: 'Maximum in euros',
    });

    await user.clear(maximum);
    await user.type(maximum, '50');
    await user.clear(minimum);
    await user.type(minimum, '60');

    expect(screen.getByText('Enter a value between 1 and 50')).toBeTruthy();
    expect(maximum).toHaveProperty('value', '50');
  });

  test('does not allow the maximum to go below the selected minimum', async () => {
    const user = userEvent.setup();
    render(
      <Range
        mode='continuous'
        min={1}
        max={100}
      />,
    );
    const minimum = screen.getByRole('spinbutton', {
      name: 'Minimum in euros',
    });
    const maximum = screen.getByRole('spinbutton', {
      name: 'Maximum in euros',
    });

    await user.clear(minimum);
    await user.type(minimum, '50');
    await user.clear(maximum);
    await user.type(maximum, '40');

    expect(screen.getByText('Enter a value between 50 and 100')).toBeTruthy();
    expect(minimum).toHaveProperty('value', '50');
  });

  test('dragging handles updates values, respects limits and prevents crossing', () => {
    const { container } = render(
      <Range
        mode='continuous'
        min={0}
        max={100}
      />,
    );
    const handles = container.querySelectorAll<HTMLElement>(
      '[aria-hidden="true"] > span[style]',
    );
    const [minimumHandle, maximumHandle] = handles;
    const track = minimumHandle.parentElement!;
    vi.spyOn(track, 'getBoundingClientRect').mockReturnValue({
      left: 100,
      width: 200,
    } as DOMRect);

    const drag = (handle: HTMLElement, clientX: number) => {
      handle.setPointerCapture = vi.fn();
      handle.hasPointerCapture = vi.fn().mockReturnValue(true);
      fireEvent(
        handle,
        Object.assign(new MouseEvent('pointerdown', { bubbles: true }), {
          pointerId: 1,
        }),
      );
      fireEvent(
        handle,
        Object.assign(
          new MouseEvent('pointermove', { bubbles: true, clientX }),
          { pointerId: 1 },
        ),
      );
    };

    const minimum = screen.getByRole('spinbutton', {
      name: 'Minimum in euros',
    });
    const maximum = screen.getByRole('spinbutton', {
      name: 'Maximum in euros',
    });

    drag(minimumHandle, 200);
    expect(minimum).toHaveProperty('value', '50');
    drag(maximumHandle, 500);
    expect(maximum).toHaveProperty('value', '100');
    drag(maximumHandle, 120);
    expect(maximum).toHaveProperty('value', '50');
    drag(minimumHandle, 0);
    expect(minimum).toHaveProperty('value', '0');
    drag(minimumHandle, 300);
    expect(minimum).toHaveProperty('value', '50');
  });
});
