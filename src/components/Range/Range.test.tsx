import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import Range from '@/components/Range/Range';

describe('Range', () => {
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
});
