import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('streams are reducible to promise for the ultimate result', t => {
  const numbers = [1, 3, 5];
  return most.from(numbers)
    .reduce((acc, num) => acc + num, 0)
    .then(x => t.is(9, x));
});
