import test from 'ava';
import sinon from 'sinon';
import * as most from 'most';

const __ = 'Fill in the blank';

test('its easy to create stream and consume it', t => {
  return most.of(42).observe(x => t.is(x, 42));
});

test('some things may appear different, but be the same', t => {
  return most.just(42).forEach(x => t.is(x, 42));
});

test('what comes in goes out', t => {
  return most.just(101).observe(x => t.is(x, 101));
});

test('you can create a stream from an Iterable or Observable', t => {
  let result = 0;
  return most.from([1, 2, 3, 4])
    .observe(x => { result = x })
    .then(() => t.is(result, 4));
});

test('or a stream containing the outcome of a Promise', t => {
  const promise = new Promise(resolve => setTimeout(() => resolve(42), 10));
  return most.fromPromise(promise).observe(x => t.is(x, 42));
});

// what could be equivalent to nothing?
test('stream may end before it even started ', t => {
  const events = sinon.spy();
  return most.empty().observe(events).then(() => t.false(events.calledOnce));
});

test.todo('or it could be an empty stream that never ends');
