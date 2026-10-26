'use client';

import { RangeInput } from '@/components/RangeInput/RangeInput';
import { RangeStatus } from '@/components/RangeStatus/RangeStatus';
import { RangeTrack } from './RangeTrack';
import { useRangeSelection } from './useRangeSelection';
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
    const { values } = props;

    if (
      values.length < 2 ||
      values.some((value) => !Number.isFinite(value)) ||
      !values.every((value, index) => index === 0 || value > values[index - 1])
    ) {
      return (
        <RangeStatus
          variant='error'
          message='Invalid range values.'
        />
      );
    }

    return <FixedRange values={props.values} />;
  }

  const { min, max } = props;

  if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
    return (
      <RangeStatus
        variant='error'
        message='Invalid range limits.'
      />
    );
  }

  return (
    <ContinuousRange
      min={min}
      max={max}
    />
  );
}

function FixedRange({ values }: { values: number[] }) {
  const {
    selectedRange,
    trackRef,
    minPosition,
    maxPosition,
    handleMove,
    handleKeyDown,
  } = useRangeSelection({
    min: 0,
    max: values.length - 1,
    initialSelection: {
      min: 0,
      max: values.length - 1,
    },
    getValueFromPercentage: (percentage) =>
      Math.round((percentage * (values.length - 1)) / 100),
    getPercentageFromValue: (value) => (value * 100) / (values.length - 1),
  });

  return (
    <div className={styles.range}>
      <span className={styles.minLabel}>
        <span>Minimum</span>
        <span>{values[selectedRange.min]} €</span>
      </span>
      <RangeTrack
        trackRef={trackRef}
        minHandle={{
          label: 'Minimum value',
          min: values[0],
          max: values[selectedRange.max],
          value: values[selectedRange.min],
          valueText: `${values[selectedRange.min]} euros`,
          position: minPosition,
        }}
        maxHandle={{
          label: 'Maximum value',
          min: values[selectedRange.min],
          max: values.at(-1)!,
          value: values[selectedRange.max],
          valueText: `${values[selectedRange.max]} euros`,
          position: maxPosition,
        }}
        onMove={handleMove}
        onKeyDown={handleKeyDown}
      />
      <span className={styles.label}>
        <span>Maximum</span>
        <span>{values[selectedRange.max]} €</span>
      </span>
    </div>
  );
}

function ContinuousRange({ min, max }: { min: number; max: number }) {
  const {
    selectedRange,
    trackRef,
    minPosition,
    maxPosition,
    updateSelectedRange,
    handleMove,
    handleKeyDown,
  } = useRangeSelection({
    min,
    max,
    initialSelection: { min, max },
    getValueFromPercentage: (percentage) =>
      Math.round((percentage * (max - min)) / 100 + min),
    getPercentageFromValue: (value) => ((value - min) / (max - min)) * 100,
  });

  const handleChange = (value: number, id: string) => {
    updateSelectedRange(value, id === 'min' ? 'min' : 'max');
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
      <RangeTrack
        trackRef={trackRef}
        minHandle={{
          label: 'Minimum value',
          min,
          max: selectedRange.max,
          value: selectedRange.min,
          position: minPosition,
        }}
        maxHandle={{
          label: 'Maximum value',
          min: selectedRange.min,
          max,
          value: selectedRange.max,
          position: maxPosition,
        }}
        onMove={handleMove}
        onKeyDown={handleKeyDown}
      />
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
