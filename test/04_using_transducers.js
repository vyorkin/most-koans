import test from 'ava';
import * as most from 'most';
import transducers from 'transducers-js';
import R from 'ramda';

const __ = 'Fill in the blank';

test('you can apply a transducer to a stream', t => {
  const transducer = R.compose(
    R.take(4),
    R.filter(x => x % 2 === 0),
    R.map(R.add(1)),
  );

  const results = [];
  return most.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .transduce(transducer)
    .observe(x => { results.push(x) })
    .then(() => t.deepEqual([3, 5], results));
});

test('use anything that implements the de facto transducer protocol', t => {
  const { take, filter, map, comp } = transducers;
  const transducer = comp(
    take(4),
    filter(x => x % 2 === 0),
    map(x => x + 1),
  );

  const results = [];
  return most.from([1, 2, 3, 4, 5, 6, 7, 8, 9])
    .transduce(transducer)
    .observe(x => { results.push(x) })
    .then(() => t.deepEqual([3, 5], results));
});
