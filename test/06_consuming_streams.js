import test from 'ava';
import { spy } from 'sinon';
import * as most from 'most';
import * as subject from 'most-subject';

const __ = 'Fill in the blank';

test('stream are compatible with ES Observable spec draft', t => {
  const source = subject.sync();
  const observer = {
    next: spy(),
    error: spy(),
    complete: spy(),
  };

  const subscription = source.subscribe(observer);
  source.next(1);
  source.next(2);

  subscription.unsubscribe();

  source.next(3);
  source.next(4);

  source.complete();

  t.deepEqual(observer.next.args, [[1], [2]]);
  t.false(observer.error.called);
  t.false(observer.complete.called);
});

test('streams are reducible to promise for the ultimate result', async t => {
  const result = await most.from([1, 3, 5])
    .reduce((acc, num) => acc + num, 0);

  t.is(9, result);
});

test('sometimes you just dont give a fuck about the events', async t => {
  const results = [];
  const events = spy();

  await most.from([1, 2, 3])
    .tap(x => { results.push(x); }) // eslint-disable-line fp/no-mutating-methods
    .drain();

  t.false(events.called);
  t.deepEqual([1, 2, 3], results);
});

test('things can break', async t => {
  const willReject = Promise.reject('fucked up');
  try {
    await most.fromPromise(willReject).drain();
  } catch (err) {
    t.is('fucked up', err);
  }
});
