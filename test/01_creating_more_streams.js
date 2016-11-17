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
  return most.fromPromise(promise).observe(x => t.is(__, x));
});

test('you can create an infite stream of periodic events', async t => {
  // periodic(2, x): x-x-x-x-x-x->
  // periodic(5, x): x----x----x->
  //          |  |
  //          |  -- value
  //        period

  const stream = most.periodic(2, 1).take(3);
  const result = await run(stream).tick(5);

  t.deepEqual(__, result.events);
});

test('stream may end before it even started', async t => {
  const events = sinon.spy();
  await most.empty().observe(events);
  t.is(__, events.called);
});

test.cb('or it could be an empty stream that never ends', t => {
  const events = sinon.spy();

  // lets give it a chance to finish execution
  setImmediate(() => {
    t.is(__, events.calledOnce);
    t.end();
  });

  most.never().observe(events);
});

test('you can build a stream by computing successive items iteratively', async t => {
  let sum = 0;

  await most.iterate(x => x + 1, 0)
    .take(4)
    .observe(x => { sum += x; });

  t.is(__, sum);
});

test('the iterating function may return a promise', async t => {
  let result = 0;
  await most.iterate(x => delay(x + 1), 1)
    .take(3)
    .observe(x => { result += x; });
  t.is(__, result);
});

/* eslint-disable fp/no-loops,no-unreachable */
test('you can use generators as well', t => {
  function* numbers() {
    for (let i = 0; ; i++) {
      yield i;
    }

    let sum = 0;
    return most.from(numbers)
      .take(3)
      .observe(x => { sum += x; })
      .then(() => t.is(__, sum));
  }
});
/* eslint-enable no-unreachable */

test('even async generators', async t => {
  function* countdown() {
    for (let i = 3; i > 0; i--) { // eslint-disable-line fp/no-loops
      yield delay(i);
    }
  }

  let result = 0;
  await most.generate(countdown, 100, 3)
    .observe(x => { result += x; });

  t.is(__, result);
});
/* eslint-enable fp/no-loops */

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

  t.deepEqual(__, values);
  t.is(__, final);
});
