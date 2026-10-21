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

  const { min, max } = props;

  return (
    <div className={styles.range}>
      <div className={styles.labels}>
        <span>Minimum: {min}</span>
        <span>Maximum: {max}</span>
      </div>
      <div
        className={styles.track}
        aria-hidden='true'
      >
        <span className={styles.handle} />
        <span className={styles.handle} />
      </div>
    </div>
  );
}
