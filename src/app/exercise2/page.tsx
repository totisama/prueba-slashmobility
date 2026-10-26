import { Suspense } from 'react';
import BackLink from '@/components/BackLink/BackLink';
import Page from '@/components/Page/Page';
import Range from '@/components/Range/Range';
import { RangeStatus } from '@/components/RangeStatus/RangeStatus';
import { loadRangeValues } from '@/lib/range-api';

async function RangeValues() {
  const result = await loadRangeValues();

  if (result.error) {
    return (
      <RangeStatus
        variant='error'
        message='Unable to load the range values. Please try again.'
      />
    );
  }

  return (
    <Range
      mode='fixed'
      values={result.data}
    />
  );
}

export default function Exercise2Page() {
  return (
    <Page>
      <BackLink />
      <h1>Exercise 2</h1>
      <p>Fixed values range</p>
      <Suspense
        fallback={
          <RangeStatus
            variant='loading'
            message='Loading range values...'
          />
        }
      >
        <RangeValues />
      </Suspense>
    </Page>
  );
}
