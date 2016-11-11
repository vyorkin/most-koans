import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('you can recover from a stream failure', t => {
  let result = 0;
  return most.fromPromise(Promise.reject(-1))
    .recoverWith(e => most.just(e + 2))
    .observe(x => { result = x })
    .then(() => t.is(result, 1));
});

test('or create a stream in the error state', t => {
  t.throws(most.throwError(-1));
});
