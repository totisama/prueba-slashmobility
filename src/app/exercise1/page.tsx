import { Suspense } from 'react';
import BackLink from '@/components/BackLink/BackLink';
import Page from '@/components/Page/Page';
import Range from '@/components/Range/Range';
import { RangeStatus } from '@/components/RangeStatus/RangeStatus';
import { loadRangeLimits } from '@/lib/range-api';

async function RangeLimits() {
  const result = await loadRangeLimits();

  if (result.error) {
    return (
      <RangeStatus
        variant='error'
        message='Unable to load the range limits. Please try again.'
      />
    );
  }

  return (
    <Range
      mode='continuous'
      min={result.data.min}
      max={result.data.max}
    />
  );
}

export default function Exercise1Page() {
  return (
    <Page>
      <BackLink />
      <h1>Exercise 1</h1>
      <p>Continuous range</p>
      <Suspense
        fallback={
          <RangeStatus
            variant='loading'
            message='Loading range limits...'
          />
        }
      >
        <RangeLimits />
      </Suspense>
    </Page>
  );
}
