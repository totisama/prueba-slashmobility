import type { RefObject } from 'react';
import { RangeHandle } from '@/components/RangeHandle/RangeHandle';
import type { HandleType } from './useRangeSelection';
import styles from './Range.module.css';

type RangeTrackProps = {
  trackRef: RefObject<HTMLDivElement | null>;
  minPosition: number;
  maxPosition: number;
  onMove: (pointerX: number, type: HandleType) => void;
};

export function RangeTrack({
  trackRef,
  minPosition,
  maxPosition,
  onMove,
}: RangeTrackProps) {
  return (
    <div
      className={styles.track}
      aria-hidden='true'
      ref={trackRef}
    >
      <RangeHandle
        position={minPosition}
        onMove={(pointerX) => onMove(pointerX, 'min')}
      />
      <RangeHandle
        position={maxPosition}
        onMove={(pointerX) => onMove(pointerX, 'max')}
      />
    </div>
  );
}
