import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import { RangeHandle } from './RangeHandle';

describe('RangeHandle', () => {
  test('captures the pointer when pressed', () => {
    render(
      <RangeHandle
        label='Minimum value'
        min={0}
        max={100}
        value={0}
        position={0}
        onMove={vi.fn()}
        onKeyDown={vi.fn()}
      />,
    );
    const handle = screen.getByRole('slider', { name: 'Minimum value' });
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
    render(
      <RangeHandle
        label='Minimum value'
        min={0}
        max={100}
        value={0}
        position={0}
        onMove={onMove}
        onKeyDown={vi.fn()}
      />,
    );
    const handle = screen.getByRole('slider', { name: 'Minimum value' });
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

  test('exposes slider semantics and forwards keyboard events', () => {
    const onKeyDown = vi.fn();
    render(
      <RangeHandle
        label='Minimum value'
        min={0}
        max={100}
        value={50}
        position={50}
        onMove={vi.fn()}
        onKeyDown={onKeyDown}
      />,
    );
    const handle = screen.getByRole('slider', { name: 'Minimum value' });

    expect(handle.getAttribute('tabindex')).toBe('0');
    expect(handle.getAttribute('aria-valuemin')).toBe('0');
    expect(handle.getAttribute('aria-valuemax')).toBe('100');
    expect(handle.getAttribute('aria-valuenow')).toBe('50');

    fireEvent.keyDown(handle, { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalledOnce();
  });
});
