import type { RefObject } from 'react';
import { RangeHandle } from '@/components/RangeHandle/RangeHandle';
import type { HandleType } from './useRangeSelection';
import styles from './Range.module.css';

type HandleDetails = {
  label: string;
  min: number;
  max: number;
  value: number;
  valueText?: string;
  position: number;
};

type RangeTrackProps = {
  trackRef: RefObject<HTMLDivElement | null>;
  minHandle: HandleDetails;
  maxHandle: HandleDetails;
  onMove: (pointerX: number, type: HandleType) => void;
  onKeyDown: (
    event: React.KeyboardEvent<HTMLSpanElement>,
    type: HandleType,
  ) => void;
};

export function RangeTrack({
  trackRef,
  minHandle,
  maxHandle,
  onMove,
  onKeyDown,
}: RangeTrackProps) {
  return (
    <div
      className={styles.track}
      ref={trackRef}
    >
      <span
        className={styles.selection}
        style={{
          left: `${minHandle.position}%`,
          width: `${maxHandle.position - minHandle.position}%`,
        }}
        aria-hidden='true'
      />
      <RangeHandle
        {...minHandle}
        onMove={(pointerX) => onMove(pointerX, 'min')}
        onKeyDown={(event) => onKeyDown(event, 'min')}
      />
      <RangeHandle
        {...maxHandle}
        onMove={(pointerX) => onMove(pointerX, 'max')}
        onKeyDown={(event) => onKeyDown(event, 'max')}
      />
    </div>
  );
}
