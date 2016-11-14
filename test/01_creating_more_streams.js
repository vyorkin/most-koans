/* eslint-disable fp/no-let */

import test from 'ava';
import sinon from 'sinon';
import * as most from 'most';
import { run } from 'most-test';

const __ = 'Fill in the blank';

const delay = v => new Promise(
  resolve => setTimeout(resolve, v, v)
);

test('promise outcome is also a stream', t => {
  const promise = new Promise(resolve => setTimeout(() => resolve(42), 10));
  return most.fromPromise(promise).observe(x => t.is(x, 42));
});

test('you can create an infite stream of periodic events', async t => {
  // periodic(2, x): x-x-x-x-x-x->
  // periodic(5, x): x----x----x->
  //          |  |
  //          |  -- value
  //        period

  const stream = most.periodic(2, 1).take(3);
  const result = await run(stream).tick(5);

  t.deepEqual([1, 1, 1], result.events);
});

test('stream may end before it even started ', async t => {
  const events = sinon.spy();
  await most.empty().observe(events);
  t.false(events.called);
});

test.cb('or it could be an empty stream that never ends', t => {
  const events = sinon.spy();

  // lets give it a chance to finish execution
  setImmediate(() => {
    t.false(events.calledOnce);
    t.end();
  });

  most.never().observe(events);
});

test('stream may be infinite', async t => {
  let sum = 0;
  await most.iterate(x => x + 1, 0)
    .take(4)
    .observe(x => { sum += x; });
  t.is(sum, 6);
});

test('the iterating function may return a promise', async t => {
  let result = 0;
  await most.iterate(x => delay(x + 1), 0)
    .take(3)
    .observe(x => { result += x; });
  t.is(3, result);
});

/* eslint-disable no-unused-vars,fp/no-loops,no-unreachable */
test('you can use generators as well', t => {
  function* numbers() {
    for (let i = 0; ; i++) {
      yield i;
    }

    let sum = 0;
    return most.from(numbers)
      .take(3)
      .observe(x => { sum += x; })
      .then(() => t.is(sum, 6));
  }
});
/* eslint-enable no-unused-vars,fp/no-loops */

test('even async generators', async t => {
  function* countdown() {
    for (let i = 3; i > 0; i--) { // eslint-disable-line fp/no-loops,fp/no-let
      yield delay(i);
    }
  }

  let result = 0;
  await most.generate(countdown, 100, 3)
    .observe(x => { result += x; });

  t.is(6, result);
});

/* eslint-disable fp/no-mutating-methods */
test('unfold is powerful', async t => {
  // TODO: this one is too complex: explain or simplify

  const values = [];
  const final = await most.unfold(
    ms => delay(ms)
      .then(value => ({
        value,
        seed: ms + 1,
        done: ms > 3,
      })),
  0).observe(x => { values.push(x); });

  t.deepEqual([0, 1, 2, 3], values);
  t.is(final, 4);
});
/* eslint-enable fp/no-mutating-methods */

/* eslint-enable fp/no-let */
