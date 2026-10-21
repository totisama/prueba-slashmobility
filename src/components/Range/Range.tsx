'use client';

import { useState } from 'react';
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

  return (
    <ContinuousRange
      min={props.min}
      max={props.max}
    />
  );
}

function ContinuousRange({ min, max }: { min: number; max: number }) {
  const [selectedRange, setSelectedRange] = useState({ min, max });

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
      >
        <span className={styles.handle} />
        <span className={styles.handle} />
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
