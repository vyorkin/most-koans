import test from 'ava';
import * as most from 'most';
import hold from '@most/hold';
import { run } from 'most-test';

const __ = 'Fill in the blank';

// its like toProperty in Kefir
test('a held stream may have a current value', async t => {
  const source = most.periodic(5, 1)
    .take(3)
    .thru(hold);
});

test('a held stream is always multicast', t => {
});
