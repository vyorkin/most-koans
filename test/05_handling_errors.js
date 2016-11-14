import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('you can recover from a stream failure', async t => {
  let result = 0; // eslint-disable-line fp/no-let
  await most.fromPromise(Promise.reject(-1))
    .recoverWith(e => most.just(e + 2)) // alias: flatMapError
    .observe(x => { result = x; });

  t.is(result, 1);
});

test('or create a stream in the error state', t => {
  // TODO: how to convert this into an actual koan?
  t.throws(most.throwError(-1));
});
