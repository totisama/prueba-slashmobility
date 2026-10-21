import { Suspense } from 'react';
import BackLink from '@/components/BackLink/BackLink';
import Page from '@/components/Page/Page';
import { loadRangeLimits } from '@/lib/range-api';

async function RangeLimits() {
  const limits = await loadRangeLimits();

  if (!limits) {
    return <p>Unable to load the range limits.</p>;
  }

  return (
    <p>
      Minimum: {limits.min} — Maximum: {limits.max}
    </p>
  );
}

export default function Exercise1Page() {
  return (
    <Page>
      <BackLink />
      <h1>Exercise 1</h1>
      <p>Continuous range</p>
      <Suspense fallback={<p>Loading range limits...</p>}>
        <RangeLimits />
      </Suspense>
    </Page>
  );
}
