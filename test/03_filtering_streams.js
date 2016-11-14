/* eslint-disable fp/no-let */

import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('maps and filters may be combined', async t => {
  let result = []; // eslint-disable-line prefer-const
  await most.from([1, 2, 3, 4, 5])
    .map(x => x * x)
    .filter(x => x % 2 === 0)
    .observe(x => { result.push(x); }); // eslint-disable-line fp/no-mutating-methods

  t.deepEqual([4, 16], result);
});

test('you can skip repeated events', async t => {
  const numbers = [1, 1, 1, 1, 2, 3, 3];
  const sum = await most.from(numbers)
    .skipRepeats()
    .reduce((acc, x) => acc + x, 0);

  t.is(6, sum);
});

test('if you need to, you can provide your own equality function', async t => {
  const word = await most.from('helLo')
    .skipRepeatsWith((x, y) => x.toLowerCase() === y.toLowerCase())
    .reduce((acc, letter) => acc + letter, '');

  t.is('helo', word);
});

/* eslint-enable fp/no-let */
