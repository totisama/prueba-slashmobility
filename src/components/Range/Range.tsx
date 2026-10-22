'use client';

import { useRef, useState } from 'react';
import { RangeHandle } from '@/components/RangeHandle/RangeHandle';
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

  const handleMove = (pointerX: number, type: 'min' | 'max') => {
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const percentage = (pointerX - trackRect.left) / trackRect.width;
    const calculatedValue = Math.round(percentage * (max - min) + min);
    const value = Math.max(min, Math.min(max, calculatedValue));

    setSelectedRange((prev) => {
      if (type === 'min') {
        const nextMin = Math.min(value, prev.max);
        if (nextMin === prev.min) return prev;
        return { ...prev, min: nextMin };
      }

      const nextMax = Math.max(value, prev.min);
      if (nextMax === prev.max) return prev;
      return { ...prev, max: nextMax };
    });
  };

  return (
    <div className={styles.range}>
      <RangeInput
        id='min'
        label='Minimum'
        value={selectedRange.min}
        min={min}
        max={selectedRange.max}
        onChange={handleChange}
      />
      <div
        className={styles.track}
        aria-hidden='true'
        ref={trackRef}
      >
        <RangeHandle
          position={minPosition}
          onMove={(pointerX) => handleMove(pointerX, 'min')}
        />
        <RangeHandle
          position={maxPosition}
          onMove={(pointerX) => handleMove(pointerX, 'max')}
        />
      </div>
      <RangeInput
        id='max'
        label='Maximum'
        value={selectedRange.max}
        min={selectedRange.min}
        max={max}
        onChange={handleChange}
      />
    </div>
  );
}
