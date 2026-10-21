import Link from 'next/link';
import styles from './BackLink.module.css';

export default function BackLink() {
  return (
    <Link
      className={styles.link}
      href='/'
    >
      Back
    </Link>
  );
}
