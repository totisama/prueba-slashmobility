import { Suspense } from 'react';
import BackLink from '@/components/BackLink/BackLink';
import Page from '@/components/Page/Page';
import { loadRangeValues } from '@/lib/range-api';

async function RangeValues() {
  const values = await loadRangeValues();

  if (!values) {
    return <p>Unable to load the range values.</p>;
  }

  return <p>Available values: {values.join(', ')}</p>;
}

export default function Exercise2Page() {
  return (
    <Page>
      <BackLink />
      <h1>Exercise 2</h1>
      <p>Fixed values range</p>
      <Suspense fallback={<p>Loading range values...</p>}>
        <RangeValues />
      </Suspense>
    </Page>
  );
}
