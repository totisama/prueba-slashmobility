import styles from './RangeHandle.module.css';

export function RangeHandle({
  position,
  onMove,
}: {
  position: number;
  onMove: (pointerX: number) => void;
}) {
  return (
    <span
      className={styles.handle}
      style={{ left: `${position}%` }}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;

        onMove(event.clientX);
      }}
    />
  );
}
