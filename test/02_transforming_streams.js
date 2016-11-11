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
    .chain(x => most.iterate(x => x + 1, 1).take(x))
    .observe(x => { results.push(x) })
    .then(() => t.deepEqual([1, 1, 1, 2, 2, 3], results));
});

test('and flatMap is an alias for chain', t => {
  // stream:   1-2|
  // f(1):     1---1---1---1---1|
  // f(2):       2-------2-------2-------2-------2|
  // chain(f): 1-2-1---1-2-1---1-2-------2-------2|

  const results = [];
  return most.from([1, 2]).flatMap(
      x => most.periodic(x * 25)
        .take(5)
        .constant(x)
        .delay(x - 1)
    )
    .observe(x => { results.push(x) })
    .then(() => t.deepEqual([1, 2, 1, 1, 2, 1, 1, 2, 2, 2], results));
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
