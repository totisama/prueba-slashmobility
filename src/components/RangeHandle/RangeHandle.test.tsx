import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { RangeHandle } from './RangeHandle';

describe('RangeHandle', () => {
  test('captures the pointer when pressed', () => {
    const { container } = render(
      <RangeHandle
        position={0}
        onMove={vi.fn()}
      />,
    );
    const handle = container.querySelector('span')!;
    handle.setPointerCapture = vi.fn();

    fireEvent(
      handle,
      Object.assign(new MouseEvent('pointerdown', { bubbles: true }), {
        pointerId: 1,
      }),
    );

    expect(handle.setPointerCapture).toHaveBeenCalledWith(1);
  });

  test('calls onMove only while it has pointer capture', () => {
    const onMove = vi.fn();
    const { container } = render(
      <RangeHandle
        position={0}
        onMove={onMove}
      />,
    );
    const handle = container.querySelector('span')!;
    handle.hasPointerCapture = vi.fn().mockReturnValue(false);

    const movePointer = () =>
      fireEvent(
        handle,
        Object.assign(
          new MouseEvent('pointermove', { bubbles: true, clientX: 150 }),
          { pointerId: 1 },
        ),
      );

    movePointer();
    expect(onMove).not.toHaveBeenCalled();

    vi.mocked(handle.hasPointerCapture).mockReturnValue(true);
    movePointer();
    expect(onMove).toHaveBeenCalledWith(150);
  });
});
