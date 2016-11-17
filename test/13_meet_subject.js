import test from 'ava';
import * as most from 'most';
import { spy } from 'sinon';
import * as subject from 'most-subject';

const __ = 'Fill in the blank';

test('subject allows imperatively pushing values', t => {
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
