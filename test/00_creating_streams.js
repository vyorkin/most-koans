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

test('you can create a stream from any Iterable', t => {
  let result = 0;
  return most.from([1, 2, 3, 4])
    .observe(x => { result = x })
    .then(() => t.is(result, 4));
});

test('everything counts', t => {
  let count = 0;
  const numbers = [1, 2, 3];
  return most.from(numbers)
    .observe(x => { count += x })
    .then(() => t.is(count, 6));
});
