import test from 'ava';
import * as most from 'most';
import { run } from 'most-test';

const __ = 'Fill in the blank';

test('you can share a stream between multiple consumers', async t => {
  // source:   1----1----1----1----1
  // source1:  1----2----4----1----1
  // source2:

  const source = most.periodic(2, 1).take(10).multicast();
  const source1 = source.map(x => x + x);
  const source2 = source.map(x => x * x);

  setTimeout(() => {
  }, 0);
});
