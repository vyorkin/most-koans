import test from 'ava';
import * as most from 'most';
import { identity } from 'ramda';

const __ = 'Fill in the blank';

const periodicFrom = (source, period = 1, mapper = identity) =>
  most.from(source).zip(mapper, most.periodic(period));

test('streams can be merged', async t => {
  const numbers = periodicFrom([1, 2, 3]);
  const letters = periodicFrom(['a', 'b', 'c']);
  const stream = most.merge(numbers, letters);
  const result = await stream.reduce((acc, v) => acc.concat(v), []);

  t.deepEqual([1, 'a', 2, 'b', 3, 'c'], result);
});

test('or concatenated', async t => {
  const numbers = periodicFrom([1, 2, 3]);
  const letters = periodicFrom(['a', 'b', 'c']);
  const stream = most.concat(numbers, letters);
  const result = await stream.reduce((acc, v) => acc.concat(v), []);

  t.deepEqual([1, 2, 3, 'a', 'b', 'c'], result);
});

// make a koan demonstrating the difference between these 2:

// test('title', async t => {
//   await most.from([1, 2, 3])
//     .concatMap(x => most.of(x).delay(1000))
//     .tap(console.log)
//     .drain();
// });

// 1)
// const source = most.from(numbers)
//   .zip(identity, most.periodic(50));

// 2)
// const source = most.from(numbers)
//   .concatMap(x => most.of(x).delay(50));

// test('', t => {
// });
