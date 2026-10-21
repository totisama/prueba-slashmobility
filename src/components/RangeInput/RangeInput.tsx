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
  return (
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
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange && onChange(Number(e.target.value), id)}
      />
    </div>
  );
}
