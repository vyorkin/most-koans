import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

// in the beginning there was a stream
test('there are many ways to create a stream and consume it', t => {
  return most.of(42).observe(x => t.is(__, x));
});

test('some things may appear different, but be the same', t => {
  return most.just(42).forEach(x => t.is(__, x));
});

test('what comes in goes out', t => {
  return most.just(101).observe(x => t.is(__, x));
});

test('you can create a stream from any Iterable', async t => {
  let result = 0;
  await most.from([1, 2, 3, 4]).observe(x => { result = x; });
  t.is(__, result);
});

test('everything counts', async t => {
  let count = 0;
  await most.from([1, 2, 3]).observe(x => { count += x; });
  t.is(__, count);
});
