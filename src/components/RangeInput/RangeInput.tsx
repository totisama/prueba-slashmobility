import { useEffect, useRef, useState } from 'react';
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
  onChange: (value: number, id: string) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const previousValue = useRef(value);
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

    onChange(newValue, id);
  };

  const handleBlur = () => {
    if (draft === null || draft === '') return;

    const number = Number(draft);
    if (!isNaN(number) && number >= min && number <= max) {
      setDraft(null);
    }
  };

  useEffect(() => {
    if (previousValue.current !== value && error) {
      setDraft(null);
    }

    previousValue.current = value;
  }, [value, error]);

  useEffect(() => {
    if (draft === null || draft === '') return;

    const number = Number(draft);

    if (
      Number.isFinite(number) &&
      number >= min &&
      number <= max &&
      number !== value
    ) {
      onChange(number, id);
    }
  }, [draft, min, max, value, onChange, id]);

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <label htmlFor={id}>{label}</label>
        <div className={styles.inputContainer}>
          <input
            id={id}
            className={styles.input}
            type='number'
            value={draft ?? value}
            min={min}
            max={max}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <span
            className={styles.currency}
            aria-hidden='true'
          >
            €
          </span>
        </div>
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
