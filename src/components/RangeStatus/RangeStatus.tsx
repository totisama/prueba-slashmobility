import styles from './RangeStatus.module.css';

export function RangeStatus({
  message,
  variant,
}: {
  message: string;
  variant: 'loading' | 'error';
}) {
  return (
    <p
      className={`${styles.status} ${styles[variant]}`}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {message}
    </p>
  );
}
