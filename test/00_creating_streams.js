/* eslint-disable fp/no-let */

import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

// in the beginning there was a stream
test('there are many ways to create a stream and consume it', t => {
  return most.of(42).observe(x => t.is(x, 42));
});

test('some things may appear different, but be the same', t => {
  return most.just(42).forEach(x => t.is(x, 42));
});

test('what comes in goes out', t => {
  return most.just(101).observe(x => t.is(x, 101));
});

test('you can create a stream from any Iterable', async t => {
  let result = 0;
  await most.from([1, 2, 3, 4]).observe(x => { result = x; });
  t.is(result, 4);
});

test('everything counts', async t => {
  let count = 0;
  await most.from([1, 2, 3]).observe(x => { count += x; });
  t.is(count, 6);
});

/* eslint-enable fp/no-let */
