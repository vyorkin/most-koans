import test from 'ava';
import sinon from 'sinon';
import * as most from 'most';

const __ = 'Fill in the blank';

const delay = v => new Promise(
  resolve => setTimeout(resolve, v, v)
);

test('promise outcome is also a stream', t => {
  const promise = new Promise(resolve => setTimeout(() => resolve(42), 10));
  return most.fromPromise(promise).observe(x => t.is(x, 42));
});

test('you can create an infite stream of periodic events', t => {
  // periodic(2, x): x-x-x-x-x-x->
  // periodic(5, x): x----x----x->
  //          |  |
  //          |  -- value
  //        period

  let result = [];
  return most.periodic(2, 1)
    .take(3)
    .observe(x => { result.push(x) })
    .then(() => t.deepEqual([1, 1, 1], result));
});

test('stream may end before it even started ', t => {
  const events = sinon.spy();
  return most.empty().observe(events).then(() => t.false(events.calledOnce));
});

test.todo('or it could be an empty stream that never ends');

test('stream may be infinite', t => {
  let sum = 0;
  return most.iterate(x => x + 1, 0)
    .take(4)
    .observe(x => { sum += x })
    .then(() => t.is(sum, 6));
});

test('the iterating function may return a promise', t => {
  let result = 0;
  return most.iterate(x => delay(x + 1), 0)
    .take(3)
    .observe(x => { result += x })
    .then(() => t.is(3, result));
});

test('you can use generators as well', t => {
  function* numbers() {
    for (let i = 0 ;; ++i) {
      yield i;
    }

    let sum = 0;
    return most.from(numbers)
      .take(3)
      .observe(x => { sum += x })
      .then(() => t.is(sum, 6));
  }
});

test('even async generators', t => {
  function* countdown() {
    for (let i = 3; i > 0; i--) {
      yield delay(i);
    }
  }

  let result = 0;
  return most.generate(countdown, 100, 3)
    .observe(x => { result += x })
    .then(() => t.is(6, result));
});

// this one is too complex
test('unfold is powerful', t => {
  let values = [];
  return most.unfold(
    ms => delay(ms)
      .then(value => ({
        value,
        seed: ms + 1,
        done: ms > 3,
      })),
  0).observe(x => { values.push(x) })
   .then(final => {
     t.deepEqual([0, 1, 2, 3], values);
     t.is(final, 4);
   });
});
