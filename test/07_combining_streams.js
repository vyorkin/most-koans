import test from 'ava';
import * as most from 'most';
import { identity } from 'ramda';

const __ = 'Fill in the blank';

const periodicFrom = (source, period = 1, mapper = identity) =>
  most.from(source).zip(mapper, most.periodic(period));

const numbers = periodicFrom([1, 2, 3]);
const letters = periodicFrom(['a', 'b', 'c']);

test('streams can be merged', async t => {
  const stream = most.merge(numbers, letters);
  const result = await stream.reduce((acc, v) => acc.concat(v), []);

  t.deepEqual([1, 'a', 2, 'b', 3, 'c'], result);
});

test('mergeArray is the same as merge but takes an array of streams', async t => {
  const stream = most.mergeArray([numbers, letters]);
  const result = await stream.reduce((acc, v) => acc.concat(v), []);

  t.deepEqual([1, 'a', 2, 'b', 3, 'c'], result);
});

test('you can concatenate streams', async t => {
  const stream = most.concat(numbers, letters);
  const result = await stream.reduce((acc, v) => acc.concat(v), []);

  t.deepEqual([1, 2, 3, 'a', 'b', 'c'], result);
});

test('combining streams is easy', async t => {
  // t:   -0----1----2----3----4----5----6----7-->
  // n:   -1---------2---------3|
  // l:   -a--------------b--------------c|
  // r:   -1a--------2a---2b---3b--------3c|

  const numbersPer2Ms = periodicFrom([1, 2, 3], 2);
  const lettersPer3Ms = periodicFrom(['a', 'b', 'c'], 3);

  // combineArray is the same thing, it just takes an array
  const stream = most.combine((x, y) => x + y, numbersPer2Ms, lettersPer3Ms);
  const result = await stream.reduce((acc, v) => acc.concat(v), []);

  t.deepEqual(['1a', '2a', '2b', '3b', '3c'], result);
});

// TODO: sample, sampleWith, zip
