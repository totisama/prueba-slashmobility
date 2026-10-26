import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import Range from '@/components/Range/Range';

describe('Range', () => {
  describe('fixed mode', () => {
    test('shows the first and last fixed values with handles at the ends', () => {
      const { container } = render(
        <Range
          mode='fixed'
          values={[1.99, 5.99, 70.99]}
        />,
      );

      expect(screen.getByText('1.99 €')).toBeTruthy();
      expect(screen.getByText('70.99 €')).toBeTruthy();
      expect(screen.queryByRole('spinbutton')).toBeNull();

      const handles =
        container.querySelectorAll<HTMLElement>('[role="slider"]');
      expect(handles).toHaveLength(2);
      expect(handles[0].style.left).toBe('0%');
      expect(handles[1].style.left).toBe('100%');
    });

    test('shows an error when there are no fixed values', () => {
      render(
        <Range
          mode='fixed'
          values={[]}
        />,
      );

      expect(screen.getByRole('alert')).toHaveProperty(
        'textContent',
        'Invalid range values.',
      );
    });

    test('shows an error when there is only one fixed value', () => {
      render(
        <Range
          mode='fixed'
          values={[1.99]}
        />,
      );

      expect(screen.getByText('Invalid range values.')).toBeTruthy();
    });

    test.each([NaN, Infinity, -Infinity])(
      'shows an error when a fixed value is not finite',
      (invalidValue) => {
        render(
          <Range
            mode='fixed'
            values={[1.99, invalidValue, 70.99]}
          />,
        );

        expect(screen.getByText('Invalid range values.')).toBeTruthy();
      },
    );

    test.each([
      [1.99, 10.99, 5.99],
      [1.99, 5.99, 5.99],
    ])('shows an error for unordered or repeated values', (...values) => {
      render(
        <Range
          mode='fixed'
          values={values}
        />,
      );
      expect(screen.getByText('Invalid range values.')).toBeTruthy();
    });

    test('dragging selects fixed options, respects limits and prevents crossing', () => {
      const { container } = render(
        <Range
          mode='fixed'
          values={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]}
        />,
      );
      const [minimumHandle, maximumHandle] =
        container.querySelectorAll<HTMLElement>('[role="slider"]');
      vi.spyOn(
        minimumHandle.parentElement!,
        'getBoundingClientRect',
      ).mockReturnValue({
        left: 100,
        width: 200,
      } as DOMRect);

      const move = (handle: HTMLElement, clientX: number) => {
        handle.hasPointerCapture = vi.fn().mockReturnValue(true);
        fireEvent(
          handle,
          Object.assign(
            new MouseEvent('pointermove', { bubbles: true, clientX }),
            { pointerId: 1 },
          ),
        );
      };

      move(minimumHandle, 180);
      expect(screen.getByText('10.99 €')).toBeTruthy();
      expect(minimumHandle.style.left).toBe('40%');

      move(maximumHandle, 220);
      expect(screen.getByText('30.99 €')).toBeTruthy();
      expect(maximumHandle.style.left).toBe('60%');

      move(minimumHandle, 300);
      expect(minimumHandle.style.left).toBe('60%');
      expect(screen.getAllByText('30.99 €')).toHaveLength(2);

      move(minimumHandle, 0);
      expect(screen.getByText('1.99 €')).toBeTruthy();
      expect(minimumHandle.style.left).toBe('0%');

      move(maximumHandle, 500);
      expect(screen.getByText('70.99 €')).toBeTruthy();
      expect(maximumHandle.style.left).toBe('100%');

      move(minimumHandle, 180);
      move(maximumHandle, 100);
      expect(maximumHandle.style.left).toBe('40%');
      expect(screen.getAllByText('10.99 €')).toHaveLength(2);
    });

    test('updates fixed handles with the keyboard without crossing', () => {
      render(
        <Range
          mode='fixed'
          values={[1.99, 5.99, 10.99]}
        />,
      );
      const minimum = screen.getByRole('slider', { name: 'Minimum value' });
      const maximum = screen.getByRole('slider', { name: 'Maximum value' });

      fireEvent.keyDown(minimum, { key: 'ArrowRight' });
      expect(minimum.getAttribute('aria-valuenow')).toBe('5.99');

      fireEvent.keyDown(maximum, { key: 'Home' });
      expect(maximum.getAttribute('aria-valuenow')).toBe('5.99');

      fireEvent.keyDown(minimum, { key: 'Home' });
      expect(minimum.getAttribute('aria-valuenow')).toBe('1.99');

      fireEvent.keyDown(maximum, { key: 'End' });
      expect(maximum.getAttribute('aria-valuenow')).toBe('10.99');
    });
  });

  describe('continuous mode', () => {
    test('uses the selected values as input limits', () => {
      render(
        <Range
          mode='continuous'
          min={1}
          max={10}
        />,
      );
      expect(
        screen.getByRole('spinbutton', { name: 'Minimum' }).getAttribute('max'),
      ).toBe('10');
      expect(
        screen.getByRole('spinbutton', { name: 'Maximum' }).getAttribute('min'),
      ).toBe('1');
    });

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

    test('allows limits that are 10 units apart', () => {
      render(
        <Range
          mode='continuous'
          min={1}
          max={11}
        />,
      );
      expect(
        screen.getByRole('spinbutton', { name: 'Minimum' }),
      ).toHaveProperty('value', '1');
      expect(
        screen.getByRole('spinbutton', { name: 'Maximum' }),
      ).toHaveProperty('value', '11');
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
        screen.getByRole('spinbutton', { name: 'Minimum' }),
      ).toHaveProperty('value', '1');
      expect(
        screen.getByRole('spinbutton', { name: 'Maximum' }),
      ).toHaveProperty('value', '100');
    });

    test('shows the selected segment between both handles', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Range
          mode='continuous'
          min={0}
          max={100}
        />,
      );
      const selection = container.querySelector<HTMLElement>(
        '[aria-hidden="true"][style]',
      );
      const minimum = screen.getByRole('spinbutton', {
        name: 'Minimum',
      });
      const maximum = screen.getByRole('spinbutton', {
        name: 'Maximum',
      });

      expect(selection?.style.left).toBe('0%');
      expect(selection?.style.width).toBe('100%');

      await user.clear(minimum);
      await user.type(minimum, '20');
      await user.clear(maximum);
      await user.type(maximum, '80');

      expect(selection?.style.left).toBe('20%');
      expect(selection?.style.width).toBe('60%');
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

      const input = screen.getByRole('spinbutton', {
        name: 'Minimum',
      });
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

      const input = screen.getByRole('spinbutton', {
        name: 'Maximum',
      });
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
      const input = screen.getByRole('spinbutton', {
        name: 'Minimum',
      });
      const handle = container.querySelector<HTMLElement>('[role="slider"]');

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
      const input = screen.getByRole('spinbutton', {
        name: 'Minimum',
      });
      const handle = container.querySelector<HTMLElement>('[role="slider"]');

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
        name: 'Minimum',
      });
      const maximum = screen.getByRole('spinbutton', {
        name: 'Maximum',
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
        name: 'Minimum',
      });
      const maximum = screen.getByRole('spinbutton', {
        name: 'Maximum',
      });

      await user.clear(minimum);
      await user.type(minimum, '50');
      await user.clear(maximum);
      await user.type(maximum, '40');

      expect(screen.getByText('Enter a value between 50 and 100')).toBeTruthy();
      expect(minimum).toHaveProperty('value', '50');
    });

    test('allows the selected values to match without crossing', async () => {
      const user = userEvent.setup();
      render(
        <Range
          mode='continuous'
          min={1}
          max={100}
        />,
      );
      const minimum = screen.getByRole('spinbutton', {
        name: 'Minimum',
      });
      const maximum = screen.getByRole('spinbutton', {
        name: 'Maximum',
      });

      await user.clear(minimum);
      await user.type(minimum, '50');
      await user.clear(maximum);
      await user.type(maximum, '50');

      expect(screen.queryByText('Enter a value between 50 and 100')).toBeNull();
      expect(maximum).toHaveProperty('value', '50');
    });

    test('updates continuous handles with the keyboard without crossing', () => {
      render(
        <Range
          mode='continuous'
          min={0}
          max={100}
        />,
      );
      const minimum = screen.getByRole('slider', { name: 'Minimum value' });
      const maximum = screen.getByRole('slider', { name: 'Maximum value' });

      fireEvent.keyDown(minimum, { key: 'ArrowRight' });
      expect(minimum.getAttribute('aria-valuenow')).toBe('1');

      fireEvent.keyDown(maximum, { key: 'ArrowDown' });
      expect(maximum.getAttribute('aria-valuenow')).toBe('99');

      fireEvent.keyDown(minimum, { key: 'End' });
      expect(minimum.getAttribute('aria-valuenow')).toBe('99');

      fireEvent.keyDown(minimum, { key: 'Home' });
      expect(minimum.getAttribute('aria-valuenow')).toBe('0');

      fireEvent.keyDown(maximum, { key: 'End' });
      expect(maximum.getAttribute('aria-valuenow')).toBe('100');
    });

    test('dragging handles updates values, respects limits and prevents crossing', () => {
      const { container } = render(
        <Range
          mode='continuous'
          min={0}
          max={100}
        />,
      );
      const handles =
        container.querySelectorAll<HTMLElement>('[role="slider"]');
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
          Object.assign(
            new MouseEvent('pointerdown', {
              bubbles: true,
              clientX: 100 + (parseFloat(handle.style.left) / 100) * 200,
            }),
            {
              pointerId: 1,
            },
          ),
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
        name: 'Minimum',
      });
      const maximum = screen.getByRole('spinbutton', {
        name: 'Maximum',
      });

      drag(minimumHandle, 300);
      expect(minimum).toHaveProperty('value', '100');
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
      drag(maximumHandle, 240);
      expect(maximum).toHaveProperty('value', '70');
    });
  });
});
