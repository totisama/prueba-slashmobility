'use client';

import { useRef, useState } from 'react';
import { RangeInput } from '@/components/RangeInput/RangeInput';
import styles from './Range.module.css';

type RangeProps =
  | {
      mode: 'continuous';
      min: number;
      max: number;
    }
  | {
      mode: 'fixed';
      values: number[];
    };

export default function Range(props: RangeProps) {
  if (props.mode === 'fixed') {
    return null;
  }

  if (
    !Number.isFinite(props.min) ||
    !Number.isFinite(props.max) ||
    props.min >= props.max
  ) {
    return <p>Invalid range limits.</p>;
  }

  return (
    <ContinuousRange
      min={props.min}
      max={props.max}
    />
  );
}

function ContinuousRange({ min, max }: { min: number; max: number }) {
  const [selectedRange, setSelectedRange] = useState({ min, max });
  const trackRef = useRef<HTMLDivElement>(null);

  const minPosition = ((selectedRange.min - min) / (max - min)) * 100;
  const maxPosition = ((selectedRange.max - min) / (max - min)) * 100;

  const handleChange = (value: number, id: string) => {
    setSelectedRange((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  return (
    <div className={styles.range}>
      <div
        className={styles.track}
        aria-hidden='true'
        ref={trackRef}
      >
        <span
          className={styles.handle}
          style={{ left: `${minPosition}%` }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

            const track = trackRef.current;
            if (!track) return;

            const trackRect = track.getBoundingClientRect();
            const percentage =
              (event.clientX - trackRect.left) / trackRect.width;
            const value = Math.round(percentage * (max - min) + min);

            if (value < min || value > max) return;

            setSelectedRange((prev) => {
              if (value > prev.max || value === prev.min) {
                return prev;
              }

              return { ...prev, min: value };
            });
          }}
        />
        <span
          className={styles.handle}
          style={{ left: `${maxPosition}%` }}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

            const track = trackRef.current;
            if (!track) return;

            const trackRect = track.getBoundingClientRect();
            const percentage =
              (event.clientX - trackRect.left) / trackRect.width;
            const value = Math.round(percentage * (max - min) + min);

            if (value < min || value > max) return;

            setSelectedRange((prev) => {
              if (value < prev.min || value === prev.max) {
                return prev;
              }

              return { ...prev, max: value };
            });
          }}
        />
      </div>
      <div className={styles.labels}>
        <RangeInput
          id='min'
          label='Min'
          value={selectedRange.min}
          min={min}
          max={selectedRange.max}
          onChange={handleChange}
        />
        <RangeInput
          id='max'
          label='Max'
          value={selectedRange.max}
          min={selectedRange.min}
          max={max}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
