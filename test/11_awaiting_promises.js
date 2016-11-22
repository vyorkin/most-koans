import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

const delay = v => new Promise(
  resolve => setTimeout(resolve, v, v)
);

test('you can map promises to their fulfillment values', async t => {
  const results = [];
  await most.from([1, 2, 3])
    .map(delay)
    .await()
    .tap(v => { results.push(v); })
    .drain();

  t.deepEqual([__], results);
});
