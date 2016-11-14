import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

const numbers = most.from([1, 2, 3]).zip(x => x, most.periodic(1));
const letters = most.from(['a', 'b', 'c']).zip(x => x, most.periodic(1));

test('streams can be merged', async t => {
  const stream = most.merge(numbers, letters);
  const result = await stream.reduce((acc, v) => acc.concat(v), []);

  t.deepEqual([1, 'a', 2, 'b', 3, 'c'], result);
});

test('or concatenated', async t => {
  const stream = most.concat(numbers, letters);
  const result = await stream.reduce((acc, v) => acc.concat(v), []);

  t.deepEqual([1, 2, 3, 'a', 'b', 'c'], result);
});

// make a koan demonstrating the difference between these 2:

// 1)
// const source = most.from(numbers)
//   .zip(x => x, most.periodic(50));

// 2)
// const source = most.from(numbers)
//   .concatMap(x => most.of(x).delay(50));

// test('', t => {
// });
