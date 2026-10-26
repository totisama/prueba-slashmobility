import type { KeyboardEvent } from 'react';
import { useRef, useState } from 'react';

export type HandleType = 'min' | 'max';

type RangeSelection = {
  min: number;
  max: number;
};

type UseRangeSelectionOptions = {
  min: number;
  max: number;
  initialSelection: RangeSelection;
  getValueFromPercentage: (percentage: number) => number;
  getPercentageFromValue: (value: number) => number;
};

export function useRangeSelection({
  min,
  max,
  initialSelection,
  getValueFromPercentage,
  getPercentageFromValue,
}: UseRangeSelectionOptions) {
  const [selectedRange, setSelectedRange] = useState(initialSelection);
  const trackRef = useRef<HTMLDivElement>(null);

  const updateSelectedRange = (value: number, type: HandleType) => {
    setSelectedRange((previousRange) => {
      if (type === 'min') {
        const nextMin = Math.max(min, Math.min(value, previousRange.max));

        if (nextMin === previousRange.min) return previousRange;

        return { ...previousRange, min: nextMin };
      }

      const nextMax = Math.min(max, Math.max(value, previousRange.min));

      if (nextMax === previousRange.max) return previousRange;

      return { ...previousRange, max: nextMax };
    });
  };

  const handleMove = (pointerX: number, type: HandleType) => {
    const track = trackRef.current;
    if (!track) return;

    const trackRect = track.getBoundingClientRect();
    const percentage = ((pointerX - trackRect.left) / trackRect.width) * 100;
    const value = getValueFromPercentage(percentage);

    updateSelectedRange(value, type);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLSpanElement>,
    type: HandleType,
  ) => {
    const currentValue = type === 'min' ? selectedRange.min : selectedRange.max;
    let nextValue = currentValue;

    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      nextValue -= 1;
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      nextValue += 1;
    } else if (event.key === 'Home') {
      nextValue = min;
    } else if (event.key === 'End') {
      nextValue = max;
    } else {
      return;
    }

    event.preventDefault();
    updateSelectedRange(nextValue, type);
  };

  return {
    selectedRange,
    trackRef,
    minPosition: getPercentageFromValue(selectedRange.min),
    maxPosition: getPercentageFromValue(selectedRange.max),
    updateSelectedRange,
    handleMove,
    handleKeyDown,
  };
}
