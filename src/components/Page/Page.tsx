import type { ReactNode } from 'react';
import styles from './Page.module.css';

type PageProps = {
  children: ReactNode;
};

export default function Page({ children }: PageProps) {
  return <main className={styles.page}>{children}</main>;
}
