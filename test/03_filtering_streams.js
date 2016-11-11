import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('maps and filters may be combined', t => {
  let result = [];
  return most.from([1, 2, 3, 4, 5])
    .map(x => x * x)
    .filter(x => x % 2 === 0)
    .observe(x => { result.push(x) })
    .then(() => t.deepEqual([4, 16], result));
});
