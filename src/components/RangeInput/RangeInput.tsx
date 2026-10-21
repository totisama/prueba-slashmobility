import { useState } from 'react';
import styles from './RangeInput.module.css';

export function RangeInput({
  id,
  label,
  min,
  max,
  value,
  onChange,
}: {
  id: string;
  label: string;
  min: number;
  max: number;
  value: number;
  onChange?: (value: number, id: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  let error = '';

  if (draft !== null) {
    if (draft === '' || isNaN(Number(draft))) {
      error = 'Enter a number';
    } else if (Number(draft) < min || Number(draft) > max) {
      error = `Enter a value between ${min} and ${max}`;
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);

    if (e.target.value === '') {
      return;
    }

    const newValue = Number(e.target.value);

    if (isNaN(newValue)) {
      return;
    }

    if (newValue < min || newValue > max) {
      return;
    }

    onChange?.(newValue, id);
  };

  const handleBlur = () => {
    if (draft === null || draft === '') return;

    const number = Number(draft);
    if (!isNaN(number) && number >= min && number <= max) {
      setDraft(null);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label
          className={styles.label}
          htmlFor={id}
        >
          {label}:
        </label>
        <input
          className={styles.input}
          id={id}
          type='number'
          value={draft ?? value}
          min={min}
          max={max}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>
      {error && (
        <p
          id={`${id}-error`}
          className={styles.error}
        >
          {error}
        </p>
      )}
    </div>
  );
}
