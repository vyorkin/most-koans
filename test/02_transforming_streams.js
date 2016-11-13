import test from 'ava';
import * as most from 'most';

const __ = 'Fill in the blank';

test('the map transformation relates a stream to another', t => {
  let result = '';
  const names = ['wE', 'hOpE', 'yOU', 'aRe', 'eNJoyIng', 'tHiS'];
  return most.from(names)
    .map(x => x.toLowerCase())
    .observe(x => { result += x + ' ' })
    .then(() => t.is('we hope you are enjoying this ', result));
});

test('you can create a new stream by replacing each event with a constant', t => {
  const results = [];
  return most.from([1, 2, 3])
    .constant(6)
    .forEach(x => { results.push(x) })
    .then(() => t.deepEqual([6, 6, 6], results));
});

test('scan emits incremental results', t => {
  const letters = ['a', 'b', 'c'];
  const results = [];
  return most.from(letters)
    .scan((acc, letter) => acc + letter, '')
    .observe(x => { results.push(x) })
    .then(() => t.deepEqual(['', 'a', 'ab', 'abc'], results));
});

test('chain maps each event into a stream and then merges these streams', t => {
  // stream:     1-2-3|
  // f(1):       1|
  // f(2):       1--2|
  // f(3):       1--2--3|
  // flatMap(f): 1-1-1--2-2--3|

  const results = [];
  return most.from([1, 2, 3])
    .chain(x => most.iterate(x => x + 1, 1).take(x)) // alias: flatMap
    .observe(x => { results.push(x) })
    .then(() => t.deepEqual([1, 1, 1, 2, 2, 3], results));
});

test('the beginning may end, and the ending begin', t => {
  const results = [];
  return most.from(['a', 'b', 'c'])
    .continueWith(() => most.iterate(x => x + 1, 1).take(3))
    .observe(x => { results.push(x) })
    .then(() => t.deepEqual(['a', 'b', 'c', 1, 2, 3], results));
});

test('you can concatenate streams using concatMap', t => {
  // stream:       1-2-3|
  // f(1):         1|
  // f(2):         1--2|
  // f(3):         1--2--3|
  // concatMap(f): 1--1-2--1-2-3|

  const results = [];
  return most.from([1, 2, 3])
    .concatMap(x => most.iterate(x => x + 1, 1).take(x))
    .observe(x => { results.push(x) })
    .then(() => t.deepEqual([1, 1, 2, 1, 2, 3], results));
});

test('use ap to apply the latest function to the latest value', t => {
  let result = 0;
  const functions = [
    x => x + 1,
    x => x * x,
  ];
  return most.from(functions)
    .ap(most.from([1, 2, 3, 4]))
    .observe(x => { result += x })
    .then(() => t.is(30, result));
});

test('you can add timestamps, if you want to', t => {
  return most.periodic(10)
    .take(3)
    .constant(1)
    .timestamp()
    .map(o => o.time)
    .reduce((prev, curr) => curr > prev) // every next timestamp is greater than previous
    .then(result => t.truthy(result));
});

test('or just perform any side-effect', t => {
  const results = [];
  const effects = [];

  return most.from([1, 2, 3])
    .tap(x => { effects.push(x + 1) })
    .observe(x => { results.push(x) })
    .then(() => {
      t.deepEqual([1, 2, 3], results);
      t.deepEqual([2, 3, 4], effects);
    });
});
