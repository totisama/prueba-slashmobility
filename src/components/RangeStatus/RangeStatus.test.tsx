import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { RangeStatus } from './RangeStatus';

describe('RangeStatus', () => {
  test.each([
    ['loading', 'status'],
    ['error', 'alert'],
  ] as const)(
    'uses the %s role for the corresponding variant',
    (variant, role) => {
      render(
        <RangeStatus
          variant={variant}
          message='Range message'
        />,
      );

      expect(screen.getByRole(role).textContent).toBe('Range message');
    },
  );
});
