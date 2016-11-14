import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('streams are reducible to promise for the ultimate result', async t => {
  const result = await most.from([1, 3, 5])
    .reduce((acc, num) => acc + num, 0);

  t.is(9, result);
});
