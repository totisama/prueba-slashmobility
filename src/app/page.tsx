import Link from 'next/link';
import Page from '@/components/Page/Page';
import styles from './page.module.css';

export default function Home() {
  return (
    <Page>
      <h1>Range exercises</h1>
      <nav
        className={styles.exerciseNav}
        aria-label='Exercises'
      >
        <ul>
          <li>
            <Link href='/exercise1'>Exercise 1: Continuous range</Link>
          </li>
          <li>
            <Link href='/exercise2'>Exercise 2: Fixed values range</Link>
          </li>
        </ul>
      </nav>
    </Page>
  );
}
