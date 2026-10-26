import type { KeyboardEvent } from 'react';
import styles from './RangeHandle.module.css';

export function RangeHandle({
  label,
  min,
  max,
  value,
  valueText,
  position,
  onMove,
  onKeyDown,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  valueText?: string;
  position: number;
  onMove: (pointerX: number) => void;
  onKeyDown: (event: KeyboardEvent<HTMLSpanElement>) => void;
}) {
  return (
    <span
      className={styles.handle}
      style={{ left: `${position}%` }}
      role='slider'
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

        onMove(event.clientX);
      }}
      onKeyDown={onKeyDown}
    />
  );
}
