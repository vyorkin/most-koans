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

test('you can skip repeated events', t => {
  const numbers = [1, 1, 1, 1, 2, 3, 3];
  return most.from(numbers)
    .skipRepeats()
    .reduce((sum, x) => sum + x, 0)
    .then(sum => t.is(6, sum));
});

test('if you need to, you can provide your own equality function', t => {
  return most.from('helLo')
    .skipRepeatsWith((x, y) => x.toLowerCase() === y.toLowerCase())
    .reduce((word, letter) => word + letter, '') 
    .then(word => t.is('helo', word));
});
